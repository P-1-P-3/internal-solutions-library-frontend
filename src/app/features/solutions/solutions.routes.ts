import { Routes } from "@angular/router";
import { roleGuard } from "../../core/guards/role.guard";

export const solutionsRoutes: Routes = [
    {
        path: '',
        title: 'Catalogo',
        loadComponent: () => import('./pages/catalog/catalog-solution.component'),
        canActivate: [ roleGuard([1, 2]) ]
    },
    {
        path: 'detail/:solution_id',
        title: 'Detalle de solución',
        loadComponent: () => import('./pages/detail/detail.component'),
        canActivate: [ roleGuard([1, 2]) ]
    },
    {
        path: 'my-contributions',
        title: 'Mis contribuciones',
        loadComponent: () => import('./pages/my-contributions/my-contributions.component'),
        canActivate: [ roleGuard([1, 2]) ]
    },
    {
        path: 'contribute',
        title: 'Contribuir',
        loadComponent: () => import('./pages/contribute/contribute.component'),
        canActivate: [ roleGuard([1, 2]) ]
    },
    {
        path: 'edit/:solution_id',
        title: 'Editar solución',
        loadComponent: () => import('./pages/contribute/contribute.component'),
        canActivate: [ roleGuard([1, 2]) ]
    }
];

export default solutionsRoutes;