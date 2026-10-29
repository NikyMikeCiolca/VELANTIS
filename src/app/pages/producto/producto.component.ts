import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { GarmentArtComponent } from '../../components/garment-art/garment-art.component';
import { ModelViewerComponent } from '../../components/model-viewer/model-viewer.component';
import { GENERO_LABEL, MEDIDA_LABEL, Medida, PRENDA_LABEL } from '../../interfaces/product.interface';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-producto',
  // ModelViewerComponent solo se usa dentro de @defer: Angular lo saca a un chunk aparte (con three.js dentro).
  imports: [RouterLink, GarmentArtComponent, ModelViewerComponent],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoComponent {
  private readonly products = inject(ProductService);
  private readonly titleService = inject(Title);

  readonly slug = input.required<string>();

  protected readonly GENERO_LABEL = GENERO_LABEL;
  protected readonly PRENDA_LABEL = PRENDA_LABEL;
  protected readonly MEDIDA_LABEL = MEDIDA_LABEL;

  // Formatea 49.95 → "49,95 €" sin necesitar registrar el locale de Angular. 
  protected readonly eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

  protected readonly product = computed(() => this.products.bySlug(this.slug()));

  // Color elegido. linkedSignal: vuelve a 0 (el primero) cada vez que cambia el producto.
  protected readonly selectedColorIndex = linkedSignal({ source: this.slug, computation: () => 0 });
  protected readonly activeColor = computed(
    () => this.product()?.colors[this.selectedColorIndex()]?.hex ?? '#fafafa',
  );

  // Columnas de la tabla de tallas: las medidas que tiene esta prenda. 
  protected readonly medidas = computed(() => {
    const first = this.product()?.sizes[0];
    return first ? (Object.keys(first.measures) as Medida[]) : [];
  });

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) this.titleService.setTitle(`${p.name} · Velantis`);
    });
  }

  protected selectColor(index: number): void {
    this.selectedColorIndex.set(index);
  }
}