import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { catchError, map, of } from "rxjs";

export function roleGuard(allowedRoles: number[]): CanActivateFn {
    return () => {
        const _authService = inject(AuthService);
        const _router      = inject(Router);

        return _authService.getMe().pipe(
            map(({ data: user }) => 
                allowedRoles.includes(user.role.id)
                    ? true
                    : _router.createUrlTree(['/'])
            ),
            catchError(() => of(_router.createUrlTree(['/auth'])))
        );
    };
}