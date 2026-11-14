import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, map, of } from "rxjs";
import { AuthService } from "../services/auth.service";

export const authGuard = () => {
    const _authService = inject(AuthService);
    const _router      = inject(Router);

    return _authService.getMe().pipe(
        map(() => true),
        catchError(() => {
            void _router.navigate(['/auth']);
            return of(false);
        })
    );
};