import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'catalog',
        loadChildren: () => import('./features/solutions/solutions.routes')
    }
];
