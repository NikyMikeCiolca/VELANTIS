import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);

    title.setTitle('Página no encontrada · Velantis');
    meta.updateTag({ name: 'robots', content: 'noindex' });

    inject(DestroyRef).onDestroy(() => meta.removeTag("name='robots'"));
  }

}
