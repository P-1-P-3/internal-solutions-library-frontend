import { Component, computed, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    imports: [RouterLink]
})
export class HeaderComponent {
    private readonly _authService = inject(AuthService);
    private readonly _router      = inject(Router);

    readonly userData = computed(() => this._authService.currentUser());

    readonly menuItems = [
        { label: 'Inicio', route: '/' },
        { label: 'Catálogo', route: '/catalog' },
        { label: 'Contribuir', route: '/catalog/contribute' }
    ];

    logout() {
        this._authService.logout().subscribe({
            next: (res) => this._router.navigate(['/auth'])
        });
    };

    getNameInitials(name: string): string {
        const nameSeg = name.split(' ');

        const initial1 = nameSeg.at(0)?.at(0);
        const initial2 = nameSeg.at(1)?.at(0);
        return `${initial1}${initial2}`;
    };
};