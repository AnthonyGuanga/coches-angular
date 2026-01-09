import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { cocheComponent } from './components/coche/coche.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category', component: cocheComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'category-detalle/:id',
    loadComponent: () =>
      import('./components/coche-detalle/coche-detalle.component').then(
        (m) => m.CategoryDetalleComponent
      ),
  },
];
