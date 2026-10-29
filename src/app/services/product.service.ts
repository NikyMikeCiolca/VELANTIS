import { Injectable } from '@angular/core';
import { PRODUCTS } from '../data/products.data';
import { Genero, Prenda, Product } from '../interfaces/product.interface';
 
/** Acceso a los datos del catálogo. Hoy lee un array estático; mañana podría leer un JSON sin tocar los componentes. */
@Injectable({ providedIn: 'root' })
export class ProductService {
  readonly all: readonly Product[] = PRODUCTS;
 
  bySlug(slug: string): Product | undefined {
    return this.all.find((p) => p.slug === slug);
  }
 
  /** Productos de un genero, opcionalmente filtrados por prenda. */
  filter(genero: Genero, prenda?: string): Product[] {
    return this.all.filter((p) => p.genero === genero && (!prenda || p.prenda === prenda));
  }
 
  /** Prendas distintas que existen para un genero (para pintar los filtros). */
  garmentsOf(genero: Genero): Prenda[] {
    return [...new Set(this.all.filter((p) => p.genero === genero).map((p) => p.prenda))];
  }
}