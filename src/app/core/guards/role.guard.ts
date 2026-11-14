import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export function roleGuard(allowedRoles: number[]): CanActivateFn {
    return () => {
        const _authService = inject(AuthService);
        const _router      = inject(Router);

        const user = _authService.currentUser();

        if (user && allowedRoles.includes(user.role.id))
            return true;
        
        void _router.navigate(['/']);
        return false;
    };
}