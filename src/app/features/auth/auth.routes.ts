import { Routes } from "@angular/router";

export const authRoutes: Routes = [
    {
        path: '',
        title: 'Iniciar sesión',
        loadComponent: () => import('./pages/login/login.component')
    }
];

export default authRoutes;