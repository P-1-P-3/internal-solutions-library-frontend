import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    imports: [RouterLink]
})
export class HeaderComponent {
    menuItems = [
        { label: 'Inicio', route: '/' },
        { label: 'Catálogo', route: '/catalog' },
        { label: 'Contribuir', route: '/catalog/contribute' }
    ];

};