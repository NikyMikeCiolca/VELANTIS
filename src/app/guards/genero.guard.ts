import { CanMatchFn } from '@angular/router';
import { isGenero } from '../interfaces/product.interface';

/**
 * Deja pasar /coleccion/:genero solo si el género existe (mujer, hombre, unisex).
 * Si devuelve false, el router sigue buscando y acaba en la ruta '**' → NotFoundComponent.
 */
export const generoGuard: CanMatchFn = (_route, segments) => isGenero(segments[1]?.path);