import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CocheComponent } from './components/coche/coche.component';
import { LoginComponent } from './components/login/login.component';
import { FormCocheComponent } from './admin/form-coche/form-coche.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category', component: CocheComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin/form-coche',
    component: FormCocheComponent,
  },
  {
    path: 'admin/form-coche/:id',
    component: FormCocheComponent,
  },
  {
    path: 'coche-detalle/:id',
    loadComponent: () =>
      import('./components/coche-detalle/coche-detalle.component').then(
        (m) => m.CategoryDetalleComponent
      ),
  },
];
