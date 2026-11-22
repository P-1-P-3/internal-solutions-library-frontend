import { Component, computed, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";
import { getNameInitials as formatNameInitials } from "../../utils/name-initials";

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    imports: [RouterLink]
})
export class HeaderComponent {
    private readonly _authService = inject(AuthService);
    private readonly _router      = inject(Router);

    readonly userData = computed(() => this._authService.currentUser());

    private readonly menuItems = [
        { label: 'Inicio', route: '/' },
        { label: 'Catálogo', route: '/catalog' },
        { label: 'Contribuir', route: '/catalog/contribute' },
        { label: 'Administración', route: '/admin/users' }
    ];

    readonly allowedMenuItems = computed(() => {
        if (this.userData().role.id !== 1)
            return this.menuItems.filter((item) => !item.route.includes('admin'));

        return this.menuItems;
    });

    logout() {
        this._authService.logout().subscribe({
            next: (res) => this._router.navigate(['/auth'])
        });
    };

    getNameInitials(name: string): string {
        return formatNameInitials(name);
    };
};