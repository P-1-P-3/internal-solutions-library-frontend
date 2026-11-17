import { Routes } from "@angular/router";

export const adminRoutes: Routes = [
    {
        path: 'users',
        loadChildren: () => import('./users/user.routes')
    },
    {
        path: 'tags',
        loadChildren: () => import('./tags/tag.routes')
    },
    {
        path: 'technologies',
        loadChildren: () => import('./technologies/technology.routes')
    },
    {
        path: 'categories',
        loadChildren: () => import('./categories/category.routes')
    },
    {
        path: 'functional-areas',
        loadChildren: () => import('./functional-areas/functional-area.routes')
    },
];

export default adminRoutes;