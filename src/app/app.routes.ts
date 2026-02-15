import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CocheComponent } from './components/coche/coche.component';
import { LoginComponent } from './components/login/login.component';
import { FormCocheComponent } from './admin/form-coche/form-coche.component';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard'; // <--- Importar el nuevo guard
import { CategoryDetalleComponent } from './components/coche-detalle/coche-detalle.component';
import { UserSpaceComponent } from './components/user-space/user-space.component'; // <--- Importar componente

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category', component: CocheComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'user', 
    component: UserSpaceComponent, 
    canActivate: [authGuard] // <--- Solo usuarios registrados
  },
  { path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: 'form-coche', component: FormCocheComponent },
      { path: 'form-coche/:id', component: FormCocheComponent }] },
  { path: 'coche-detalle/:id', component: CategoryDetalleComponent},
  { path: '**', component: HomeComponent }
];