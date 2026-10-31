import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { Product } from '../../interfaces/product.interface';
import { GarmentArtComponent } from '../garment-art/garment-art.component';

/** Silueta provisional: giro de reposo y de prenda elegida (grados). */
const REST_ROTATION = 62;
const ACTIVE_ROTATION = -12;
/** Cuánto se adelanta la prenda elegida hacia el usuario (px, con perspective en el CSS). */
const ACTIVE_Z = 110;

/**
 * Estado animable de cada prenda. GSAP interpola estos números y paint() los escribe en el DOM.
 *  x, y, z → desplazamiento (px)    t → "apertura" de 0 (colgada) a 1 (sacada, de frente)    o → opacidad
 */
interface ItemState {
  x: number;
  y: number;
  z: number;
  t: number;
  o: number;
}

@Component({
  selector: 'app-rack',
  imports: [GarmentArtComponent],
  templateUrl: './rack.component.html',
  styleUrl: './rack.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RackComponent {
  readonly products = input.required<readonly Product[]>();

  private readonly router = inject(Router);
  private readonly location = inject(Location);

  private readonly scroller = viewChild.required<ElementRef<HTMLElement>>('scroller');
  private readonly itemEls = viewChildren<ElementRef<HTMLElement>>('item');
  private readonly garmentEls = viewChildren<ElementRef<HTMLElement>>('garment');

  /** Índice de la prenda "sacada" del perchero (null = todas colgadas). */
  protected readonly active = signal<number | null>(null);

  /** Separación entre perchas: pocas prendas → más aire. En táctil, más separación para acertar con el dedo. */
  protected readonly pitch = computed(() => {
    const n = this.products().length;
    const base = n <= 3 ? 150 : n <= 5 ? 125 : n <= 8 ? 105 : 80;
    return this.touchMode ? Math.max(base, 130) : base;
  });

  protected readonly eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

  /** Móvil/tablet: no hay hover. Scroll con snap y la prenda centrada es la activa. */
  protected readonly touchMode = matchMedia('(hover: none)').matches;
  private readonly reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  private readonly states = new WeakMap<HTMLElement, ItemState>();
  private settleTimer = 0;

  constructor() {
    // Cada vez que cambia la prenda activa (o la lista), GSAP lleva todas las prendas a su nueva pose.
    effect(() => this.layout(this.garmentEls().map((g) => g.nativeElement), this.active()));

    // En táctil, al cambiar la lista se vuelve a calcular qué prenda queda centrada.
    effect(() => {
      if (this.touchMode && this.itemEls().length) untracked(() => this.activateCentered());
    });

    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.settleTimer);
      this.garmentEls().forEach((g) => {
        const state = this.states.get(g.nativeElement);
        if (state) gsap.killTweensOf(state);
      });
    });
  }

  // ---------- Animación ----------

  private pose(i: number, active: number | null, width: number): Omit<ItemState, 'o'> {
    if (active === null) return { x: 0, y: 0, z: 0, t: 0 };
    if (i === active) return { x: 0, y: 4, z: ACTIVE_Z, t: 1 };

    // Las vecinas se apartan lo justo; cuanto más lejos, menos se mueven (como ropa empujada en una barra).
    const d = Math.abs(i - active);
    return {
      x: Math.sign(i - active) * Math.max(width * 0.85 - this.pitch(), width * 0.12) * 0.55 ** (d - 1),
      y: 0,
      z: 0,
      t: [0.12, 0.05][d - 1] ?? 0, // las contiguas se "abren" un poco
    };
  }

  private layout(els: HTMLElement[], active: number | null): void {
    if (!els.length) return;

    const current = active !== null && active < els.length ? active : null;
    const width = els[0].offsetWidth || 220;

    els.forEach((el, i) => {
      const target = this.pose(i, current, width);
      const existing = this.states.get(el);

      if (!existing) {
        // Primera vez: la prenda "cae" a su sitio con un pequeño escalonado.
        const state: ItemState = { x: 0, y: -28, z: 0, t: 0, o: 0 };
        this.states.set(el, state);
        this.paint(el, state);
        gsap.to(state, {
          ...target,
          o: 1,
          duration: this.reduceMotion ? 0 : 0.9,
          delay: this.reduceMotion ? 0 : i * 0.07,
          ease: 'power3.out',
          onUpdate: () => this.paint(el, state),
          onComplete: () => this.paint(el, state),
        });
        return;
      }

      gsap.to(existing, {
        ...target,
        duration: this.reduceMotion ? 0 : 0.7,
        ease: 'power3.out',
        overwrite: 'auto',
        onUpdate: () => this.paint(el, existing),
        onComplete: () => this.paint(el, existing),
      });
    });
  }

  /** Escribe el estado en el DOM. Con sprite mezcla fotogramas; con silueta gira el SVG. */
  private paint(el: HTMLElement, s: ItemState): void {
    const frames = Number(el.dataset['frames']);
    let transform = `translate3d(calc(-50% + ${s.x}px), ${s.y}px, ${s.z}px)`;

    if (frames > 1) {
      // Posición fraccionaria entre fotogramas: se muestran los dos contiguos y se mezclan (fundido),
      // así el giro es continuo aunque solo haya 12 imágenes.
      const position = s.t * (frames - 1);
      const a = Math.floor(position);
      const b = Math.min(a + 1, frames - 1);
      el.style.setProperty('--frame-a', String(a / (frames - 1)));
      el.style.setProperty('--frame-b', String(b / (frames - 1)));
      el.style.setProperty('--blend', (position - a).toFixed(3));
    } else {
      transform += ` rotateY(${REST_ROTATION + (ACTIVE_ROTATION - REST_ROTATION) * s.t}deg)`;
    }

    el.style.transform = transform;
    el.style.opacity = String(s.o);
  }

  // ---------- Ratón y teclado ----------

  protected onPointerMove(event: PointerEvent): void {
    if (this.touchMode) return;

    const current = this.active();
    if (current !== null) {
      // Mientras el puntero siga sobre la prenda sacada, no se cambia de prenda (evita parpadeos).
      const garment = this.garmentEls()[current]?.nativeElement;
      if (garment) {
        const r = garment.getBoundingClientRect();
        if (event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom) {
          return;
        }
      }
    }

    const li = (event.target as Element).closest<HTMLElement>('[data-index]');
    const next = li ? Number(li.dataset['index']) : null;
    if (next !== current) this.active.set(next);
  }

  protected onPointerLeave(): void {
    if (!this.touchMode) this.active.set(null);
  }

  protected onFocus(index: number): void {
    if (!this.touchMode) this.active.set(index);
  }

  protected onBlur(): void {
    if (!this.touchMode) this.active.set(null);
  }

  // ---------- Táctil ----------

  /** Mientras el dedo desliza no se anima nada; la prenda centrada se abre cuando el scroll se asienta. */
  protected onScroll(): void {
    if (!this.touchMode) return;
    clearTimeout(this.settleTimer);
    this.settleTimer = window.setTimeout(() => this.activateCentered(), 90);
  }

  private activateCentered(): void {
    const scroller = this.scroller().nativeElement;
    const middle = scroller.scrollLeft + scroller.clientWidth / 2;

    let best = 0;
    let bestDistance = Infinity;
    this.itemEls().forEach((item, i) => {
      const li = item.nativeElement;
      const distance = Math.abs(li.offsetLeft + li.offsetWidth / 2 - middle);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });

    if (this.active() !== best) this.active.set(best);
  }

  private centerItem(index: number): void {
    const scroller = this.scroller().nativeElement;
    const li = this.itemEls()[index].nativeElement;
    const left = li.offsetLeft + li.offsetWidth / 2 - scroller.clientWidth / 2;
    scroller.scrollTo({ left, behavior: 'smooth' });
  }

  // ---------- Navegación ----------

  protected href(slug: string): string {
    return this.location.prepareExternalUrl(this.router.serializeUrl(this.router.createUrlTree(['/producto', slug])));
  }

  protected open(event: MouseEvent, slug: string, index: number): void {
    // Ctrl/Cmd/Shift/clic central: que el navegador abra la pestaña como siempre.
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();

    // En táctil, el primer toque centra la prenda y el segundo la abre.
    if (this.touchMode && this.active() !== index) {
      this.centerItem(index);
      return;
    }

    void this.router.navigate(['/producto', slug]);
  }
}