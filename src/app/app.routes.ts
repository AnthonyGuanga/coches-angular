import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', 
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)  },
  { path: 'category', 
    loadComponent: () => import('./components/coche/coche.component').then(m => m.CocheComponent) },
  { path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'user', 
    canActivate: [authGuard],
    loadComponent: () => import('./components/user-space/user-space.component').then(m => m.UserSpaceComponent) },
  { path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: 'form-coche', 
        loadComponent: () => import('./admin/form-coche/form-coche.component').then(m => m.FormCocheComponent) },
      { path: 'form-coche/:id', 
        loadComponent: () => import('./admin/form-coche/form-coche.component').then(m => m.FormCocheComponent) } ] },
  { path: 'coche-detalle/:id', 
    loadComponent: () => import('./components/coche-detalle/coche-detalle.component').then(m => m.CategoryDetalleComponent) },
  { path: 'sobre-nosotros', 
    loadComponent: () => import('./components/sobre-nosotros/sobre-nosotros.component').then(m => m.SobreNosotrosComponent) },
  { path: 'contacto', 
    loadComponent: () => import('./components/contacto/contacto.component').then(m => m.ContactoComponent) },
  { path: 'servicios',
    loadComponent: () => import('./components/servicios-garantia/servicios-garantia.component').then(m => m.ServiciosGarantiaComponent) },
  { path: '**', 
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) }
];