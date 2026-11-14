import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from "@angular/common/http";
import { catchError, EMPTY, ReplaySubject, switchMap, take, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";

// Variables globales para sincronizar el refresh del token entre múltiples peticiones
let isRefreshing = false;
let refreshTokenSubject = new ReplaySubject<string>(1);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const _authService = inject(AuthService);
    const _router      = inject(Router);

    const apiRequest = req.clone({
        withCredentials: true
    });

    if (req.url.includes('refresh'))
        return next(apiRequest);

    return next(apiRequest).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === HttpStatusCode.Unauthorized || err.status === HttpStatusCode.Forbidden) {
                
                // Si ya se está refrescando el token, espera el resultado
                if (isRefreshing) {
                    return refreshTokenSubject.pipe(
                        take(1),
                        switchMap(() => {
                            return next(req.clone({
                                withCredentials: true
                            }))
                        })
                    );
                }

                // Si no se está refrescando, inicia el refresh
                refreshTokenSubject = new ReplaySubject<string>(1);
                isRefreshing = true;
                
                return _authService.refreshToken().pipe(

                    // * Si logra actualizar el token, realiza nuevamente la petición
                    switchMap((res) => {
                        isRefreshing = false;
                        // Notifica a todas las peticiones que esperaban el nuevo token
                        refreshTokenSubject.next('');

                        const retryAuthReq = req.clone({
                            withCredentials: true
                        });

                        return next(retryAuthReq);
                    }),

                    // * Si el token expiro se redirecciona al login
                    catchError((err: HttpErrorResponse) => {
                        isRefreshing = false;
                        refreshTokenSubject.error(err);

                        if (err.url?.includes('refresh')) {
                            void _router.navigate(['/auth']);
                            return EMPTY;
                        } else {
                            return throwError(() => err);
                        }
                    })

                )
            }

            return throwError(() => err)
        })
    );
};