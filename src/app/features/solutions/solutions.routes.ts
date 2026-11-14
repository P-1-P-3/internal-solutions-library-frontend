import { Routes } from "@angular/router";
import { authGuard } from "../../core/guards/auth.guard";
import { roleGuard } from "../../core/guards/role.guard";

export const solutionsRoutes: Routes = [
    {
        path: '',
        title: 'Catalogo',
        loadComponent: () => import('./pages/catalog/catalog-solution.component'),
        canActivate: [ authGuard, roleGuard([1, 2]) ]
    },
    {
        path: 'detail/:solution_id',
        title: 'Detalle de solución',
        loadComponent: () => import('./pages/detail/detail.component'),
        canActivate: [ authGuard, roleGuard([1, 2]) ]
    },
    {
        path: 'contribute',
        title: 'Contribuir',
        loadComponent: () => import('./pages/contribute/contribute.component'),
        canActivate: [ authGuard, roleGuard([1, 2]) ]
    },
    {
        path: 'edit/:solution_id',
        title: 'Editar solución',
        loadComponent: () => import('./pages/contribute/contribute.component'),
        canActivate: [ authGuard, roleGuard([1, 2]) ]
    }
];

export default solutionsRoutes;