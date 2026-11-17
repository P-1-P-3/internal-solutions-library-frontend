import { Routes } from "@angular/router";
import { roleGuard } from "../../../core/guards/role.guard";
import { AdminLayoutComponent } from "../layout/admin-layout.component";

export const tagRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                title: 'Etiquetas',
                loadComponent: () => import('./pages/tag-list/tag-list.component'),
                canActivate: [ roleGuard([1]) ]
            }
        ]
    },
];

export default tagRoutes;