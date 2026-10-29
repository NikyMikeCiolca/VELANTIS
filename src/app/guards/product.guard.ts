import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { ProductService } from '../services/product.service';

/**
 * Deja pasar /producto/:slug solo si ese producto existe.
 * Si no existe, el router sigue buscando y acaba en '**' → NotFoundComponent.
 */
export const productGuard: CanMatchFn = (_route, segments) => {
  const slug = segments[1]?.path;
  return !!slug && inject(ProductService).bySlug(slug) !== undefined;
};