import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RackComponent } from '../../components/rack/rack.component';
import { GENERO_LABEL, Genero, PRENDA_LABEL } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-coleccion',
  imports: [RouterLink, RackComponent],
  templateUrl: './coleccion.component.html',
  styleUrl: './coleccion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColeccionComponent {
  private readonly products = inject(ProductService);

  //   genero ← /coleccion/:genero   (ya validado por generoGuard)
  //   prenda ← ?prenda=camisas
  readonly genero = input.required<Genero>();
  readonly prenda = input<string>();

  protected readonly PRENDA_LABEL = PRENDA_LABEL;

  protected readonly title = computed(() => GENERO_LABEL[this.genero()]);
  protected readonly garments = computed(() => this.products.garmentsOf(this.genero()));
  protected readonly items = computed(() => this.products.filter(this.genero(), this.prenda()));
}