import { Routes } from "@angular/router";

export const solutionsRoutes: Routes = [
    {
        path: '',
        title: 'Catalogo',
        loadComponent: () => import('./pages/catalog/catalog-solution.component')
    },
    {
        path: 'detail/:solution_id',
        title: 'Detalle de solución',
        loadComponent: () => import('./pages/detail/detail.component')
    },
    {
        path: 'contribute',
        title: 'Contribuir',
        loadComponent: () => import('./pages/contribute/contribute.component')
    }
];

export default solutionsRoutes;