import { Routes } from "@angular/router";
import { roleGuard } from "../../../core/guards/role.guard";
import { AdminLayoutComponent } from "../layout/admin-layout.component";

export const technologyRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                title: 'Tecnologías',
                loadComponent: () => import('./pages/technology-list/technology-list.component'),
                canActivate: [ roleGuard([1]) ]
            }
        ]
    },
];

export default technologyRoutes;