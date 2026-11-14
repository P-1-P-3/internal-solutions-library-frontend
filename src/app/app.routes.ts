import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/home/pages/home/home.component'),
        canActivate: [ authGuard ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes')
    },
    {
        path: 'catalog',
        loadChildren: () => import('./features/solutions/solutions.routes')
    }
];
