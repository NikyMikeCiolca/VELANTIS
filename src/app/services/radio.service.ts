import { Injectable, signal } from '@angular/core';
import { TRACKS, track } from '../interfaces/track.interface';
 
const VOLUME_KEY = 'velantis:volume';
const DEFAULT_VOLUME = 0.5;
 
@Injectable({
  providedIn: 'root',
})
export class RadioService {
  private readonly audio = new Audio();
  private queue: track[] = [];
  private failures = 0;
 
  // Grafo Web Audio: <audio> → analyser (para animar el punto) → gain (volumen) → altavoces
  // Se crea tras el primer gesto del usuario, que es cuando el navegador lo permite
  private ctx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private graphFailed = false;
  private freq = new Uint8Array(0);
  private smoothed = 0;
 
  private readonly _current = signal<track | null>(null);
  private readonly _playing = signal(false);
  private readonly _volume = signal(this.loadVolume());
 
  readonly current = this._current.asReadonly();
  readonly playing = this._playing.asReadonly();
  readonly volume = this._volume.asReadonly();
 
  constructor() {
    this.audio.preload = 'none';
    this.applyVolume();
 
    this.audio.addEventListener('play', () => this._playing.set(true));
    this.audio.addEventListener('pause', () => this._playing.set(false));
    this.audio.addEventListener('playing', () => (this.failures = 0));
    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('error', () => this.onError());
  }
 
  /** Primera interaccion del usuario: arranca solo si nunca ha sonado nada */
  start(): void {
    if (!this._current()) this.next();
  }
 
  toggle(): void {
    if (!this._current()) return this.next();
    if (this.audio.paused) void this.play();
    else this.audio.pause();
  }
 
  next(): void {
    if (this.queue.length === 0) this.queue = this.buildQueue(this._current() ?? undefined);
    const track = this.queue.shift();
    if (!track) return;
 
    this._current.set(track);
    this.audio.src = track.src;
    void this.play();
  }
 
  /** value: 0..1 (posicion del slider) */
  setVolume(value: number): void {
    this._volume.set(Math.min(1, Math.max(0, value)));
    this.applyVolume();
    try {
      localStorage.setItem(VOLUME_KEY, String(this._volume()));
    } catch {
      /* almacenamiento bloqueado: no pasa nada */
    }
  }
 
  /**
   * Intensidad de graves ahora mismo, de 0 a 1. NO es un signal a proposito:
   * se lee desde requestAnimationFrame y evita disparar deteccion de cambios 60 veces por segundo
   * Se mide ANTES del volumen, asi el punto reacciona igual con el volumen bajo
   */
  level(): number {
    if (!this.analyser) return 0;
    this.analyser.getByteFrequencyData(this.freq);
 
    const bins = 6; // ~0-1 kHz con fftSize 256: bombo y bajos
    let sum = 0;
    for (let i = 0; i < bins; i++) sum += this.freq[i];
    const raw = Math.min(1, (sum / bins / 255) * 1.25);
 
    // Ataque instantáneo, caida suave: se siente como un latido y no como parpadeo
    this.smoothed = Math.max(raw, this.smoothed * 0.86);
    return this.smoothed;
  }
 
  // ---------- internos ----------
 
  private async play(): Promise<void> {
    this.ensureGraph();
    this.ctx?.resume().catch(() => {});
    try {
      await this.audio.play();
    } catch {
      // NotAllowedError (sin gesto previo) o AbortError (cambio rapido de pista): se ignoran
    }
  }
 
  private ensureGraph(): void {
    if (this.ctx || this.graphFailed) return;
    try {
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(this.audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.6;
      const gain = ctx.createGain();
 
      source.connect(analyser);
      analyser.connect(gain);
      gain.connect(ctx.destination);
 
      this.ctx = ctx;
      this.analyser = analyser;
      this.gain = gain;
      this.freq = new Uint8Array(analyser.frequencyBinCount);
 
      // Desde ahora el volumen lo controla el GainNode (también funciona en iOS).
      this.audio.volume = 1;
      this.applyVolume();
    } catch {
      // Sin Web Audio: sigue sonando con audio.volume y el punto usa solo el brillo estático.
      this.graphFailed = true;
    }
  }
 
  /** El oido percibe el volumen de forma logarítmica: slider² da un control más natural */
  private applyVolume(): void {
    const v = this._volume() ** 2;
    if (this.gain && this.ctx) this.gain.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02);
    else this.audio.volume = v;
  }
 
  private onError(): void {
    this.failures++;
    if (this.failures >= TRACKS.length) {
      this._playing.set(false);
      return;
    }
    this.next();
  }
 
  /**
   * "Shuffle bag": baraja todo y reparte cada canción una vez por ciclo, sin repetir hasta agotar la lista
   * Regla extra: no encadena la misma canción ni el mismo artista
   */
  private buildQueue(previous?: track): track[] {
    const pool = [...TRACKS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
 
    const queue: track[] = [];
    let last = previous;
    while (pool.length) {
      const i = pool.findIndex((t) => t.id !== last?.id && t.artist !== last?.artist);
      const [track] = pool.splice(Math.max(i, 0), 1);
      queue.push(track);
      last = track;
    }
    return queue;
  }
 
  private loadVolume(): number {
    try {
      const raw = localStorage.getItem(VOLUME_KEY);
      const saved = Number(raw);
      return raw !== null && saved >= 0 && saved <= 1 ? saved : DEFAULT_VOLUME;
    } catch {
      return DEFAULT_VOLUME;
    }
  }
}