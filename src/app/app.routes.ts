import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './components/category/category.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'login', component: LoginComponent },
    {
        path: 'category-detalle/:id',
        loadComponent: () =>
            import('./components/category-detalle/category-detalle.component')
                .then(m => m.CategoryDetalleComponent)
    }

];
