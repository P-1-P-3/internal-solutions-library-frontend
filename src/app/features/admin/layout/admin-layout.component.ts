import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

@Component({
    templateUrl: 'admin-layout.component.html',
    imports: [RouterOutlet, RouterLink, RouterLinkActive]
})
export class AdminLayoutComponent {
    readonly adminSection = [
        { key: 'users', route: '/admin/users', label: 'Usuarios', description: 'Cuentas y accesos' },
        { key: 'tags', route: '/admin/tags', label: 'Tags', description: 'Etiquetas de contenido' },
        { key: 'technologies', route: '/admin/technologies', label: 'Tecnologías', description: 'Stack tecnológico' },
        { key: 'categories', route: '/admin/categories', label: 'Categorías', description: 'Formato técnico de la solución' },
        { key: 'areas', route: '/admin/functional-areas', label: 'Áreas funcionales', description: 'Dominio del problema' }
    ];
};