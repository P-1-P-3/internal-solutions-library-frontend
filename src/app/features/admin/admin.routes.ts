import { Routes } from "@angular/router";
import { roleGuard } from "../../core/guards/role.guard";

export const adminRoutes: Routes = [
    {
        path: 'users',
        children: [
            {
                path: 'new',
                title: 'Usuario',
                loadComponent: () => import('./users/pages/user-create/user-create.component'),
                canActivate: [ roleGuard([1]) ]
            },
            {
                path: ':user_id',
                title: 'Usuario',
                loadComponent: () => import('./users/pages/user-create/user-create.component'),
                canActivate: [ roleGuard([1]) ]
            }
        ]
    },
];

export default adminRoutes;