import { Routes } from "@angular/router";
import { roleGuard } from "../../../core/guards/role.guard";
import { AdminLayoutComponent } from "../layout/admin-layout.component";

export const functionalAreaRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                title: 'Áreas funcionales',
                loadComponent: () => import('./pages/functional-area-list/functional-area-list.component'),
                canActivate: [ roleGuard([1]) ]
            }
        ]
    },
];

export default functionalAreaRoutes;