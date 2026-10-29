import { Routes } from '@angular/router';
import { generoGuard } from '../app/guards/genero.guard';
import { productGuard } from '../app/guards/product.guard';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
 
export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', title: 'Velantis · Seasonal Collections' },
 
  // De momento redirige a mujer, más adelante puede ser una vista "todo"
  { path: 'coleccion', pathMatch: 'full', redirectTo: 'coleccion/mujer' },
 
  {
    path: 'coleccion/:genero',
    canMatch: [generoGuard], 
    loadComponent: () => import('./pages/coleccion/coleccion.component').then((m) => m.ColeccionComponent),
    title: 'Colección · Velantis',
  },
 
  {
    path: 'producto/:slug',
    canMatch: [productGuard], 
    loadComponent: () => import('./pages/producto/producto.component').then((m) => m.ProductoComponent),
    title: 'Producto · Velantis',
  },
 
  { path: '**', component: NotFoundComponent },
];