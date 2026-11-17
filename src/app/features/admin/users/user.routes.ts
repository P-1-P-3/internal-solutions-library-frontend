import { Routes } from "@angular/router";
import { roleGuard } from "../../../core/guards/role.guard";
import { AdminLayoutComponent } from "../layout/admin-layout.component";

export const userRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                title: 'Usuarios',
                loadComponent: () => import('./pages/user-list/user-list.component'),
                canActivate: [ roleGuard([1]) ]
            }
        ]
    },
    {
        path: 'new',
        title: 'Usuario',
        loadComponent: () => import('./pages/user-create/user-create.component'),
        canActivate: [ roleGuard([1]) ]
    },
    {
        path: ':user_id',
        title: 'Usuario',
        loadComponent: () => import('./pages/user-create/user-create.component'),
        canActivate: [ roleGuard([1]) ]
    },
];

export default userRoutes;