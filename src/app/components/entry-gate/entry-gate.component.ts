import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { RadioService } from '../../services/radio.service';
 
/**
 * Pantalla de entrada. Los navegadores no dejan reproducir audio sin un gesto del usuario,
 * asi que este click es el que arranca la radio. Usa <dialog> nativo: foco atrapado, Esc y fondo inerte gratis
 */
@Component({
  selector: 'app-entry-gate',
  templateUrl: './entry-gate.component.html',
  styleUrl: './entry-gate.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryGateComponent {
  private readonly radio = inject(RadioService);
  private readonly gate = viewChild.required<ElementRef<HTMLDialogElement>>('gate');
 
  constructor() {
    afterNextRender(() => this.gate().nativeElement.showModal());
  }
 
  protected enter(withMusic: boolean): void {
    if (withMusic) this.radio.start(); // debe ejecutarse dentro del click
    this.gate().nativeElement.close();
  }
}