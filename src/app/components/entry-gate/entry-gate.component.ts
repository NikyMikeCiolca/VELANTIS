import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { RadioService } from '../../services/radio.service';

type Choice = 'music' | 'silent';

const KEY = 'velantis:entry';
/** Ponlo en false mientras desarrollas: ng serve recarga la página al guardar y verías la pantalla cada vez. */
const RESET_ON_RELOAD = true;

/**
 * Pantalla de entrada. La elección se guarda en sessionStorage (vive mientras dure la pestaña):
 *  - Navegar por enlaces internos: ni se entera (la app no se recarga).
 *  - Escribir otra URL a mano: la página se recarga, pero la elección sigue guardada → no sale la pantalla.
 *  - F5 / recargar: se borra la elección y vuelve a salir.
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
    const saved = this.readChoice();

    if (saved) {
      // Ya eligió en esta pestaña. Tras una recarga el navegador no deja sonar sin un gesto,
      // así que la música arranca con el primer clic o tecla en cualquier parte de la página.
      if (saved === 'music') this.radio.startOnFirstInteraction();
      return;
    }

    afterNextRender(() => this.gate().nativeElement.showModal());
  }

  protected choose(choice: Choice): void {
    this.saveChoice(choice);
    if (choice === 'music') this.radio.start(); // dentro del click: gesto válido
    this.gate().nativeElement.close();
  }

  /** Esc cuenta como "entrar sin música". */
  protected onCancel(event: Event): void {
    event.preventDefault();
    this.choose('silent');
  }

  private readChoice(): Choice | null {
    try {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (RESET_ON_RELOAD && nav?.type === 'reload') sessionStorage.removeItem(KEY);

      const value = sessionStorage.getItem(KEY);
      return value === 'music' || value === 'silent' ? value : null;
    } catch {
      return null;
    }
  }

  private saveChoice(choice: Choice): void {
    try {
      sessionStorage.setItem(KEY, choice);
    } catch {
      /* almacenamiento bloqueado: se volverá a preguntar */
    }
  }
}