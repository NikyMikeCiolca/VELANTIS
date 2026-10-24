import {ChangeDetectionStrategy, Component, inject, ElementRef, effect, viewChild } from '@angular/core';
import { RadioService } from '../../services/radio.service';

@Component({
  selector: 'app-radio',
  imports: [],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioComponent {
  protected readonly radio = inject(RadioService);

  private readonly dot = viewChild<ElementRef<HTMLElement>>('dot');
  private readonly reduceMotion =
    typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  constructor() {
    // Mientras suena, un bucle de animacion escribe --level (0..1) directamente en el punto
    // Va fuera de la deteccion de cambios de Angular: cero coste por frame en el resto de la app
    effect((onCleanup) => {
      const el = this.dot()?.nativeElement;
      if (!el || !this.radio.playing() || this.reduceMotion) return;
 
      let frame = 0;
      const tick = () => {
        el.style.setProperty('--level', this.radio.level().toFixed(3));
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
 
      onCleanup(() => {
        cancelAnimationFrame(frame);
        el.style.removeProperty('--level');
      });
    });
  }
 
  protected onVolume(event: Event): void {
    this.radio.setVolume(Number((event.target as HTMLInputElement).value));
  }
}
