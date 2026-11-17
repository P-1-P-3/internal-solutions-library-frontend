import { Routes } from "@angular/router";
import { roleGuard } from "../../../core/guards/role.guard";
import { AdminLayoutComponent } from "../layout/admin-layout.component";

export const categoryRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                title: 'Categorías',
                loadComponent: () => import('./pages/category-list/category-list.component'),
                canActivate: [ roleGuard([1]) ]
            }
        ]
    },
];

export default categoryRoutes;