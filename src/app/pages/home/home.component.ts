import { ChangeDetectionStrategy, Component } from '@angular/core';
import { inject } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { RackComponent } from '../../components/rack/rack.component';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RackComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {

  private readonly products = inject(ProductService);

  private static readonly RACK_ORDER = [
    'camisa-oversize', 'camiseta-corte-recto', 'abrigo-largo', 'sudadera-capucha',
    'vestido-satinado', 'camisa-lino', 'chaqueta-ligera', 'pantalon-pinzas',
  ];

  protected readonly featured: readonly Product[] = HomeComponent.RACK_ORDER.flatMap((slug) => {
    const product = this.products.bySlug(slug);
    return product ? [product] : [];
  });
  protected readonly eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

}
