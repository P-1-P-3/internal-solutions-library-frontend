import { inject, Injectable, signal } from "@angular/core";
import { Observable, of, tap } from "rxjs";
import { configService } from "../config/config";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Login } from "../../features/auth/models/login.interface";
import { Response } from "../../shared/models/req-res.interface";
import { Me } from "../../shared/models/state.interface";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _httpClient = inject(HttpClient);
    private readonly url         = configService.url_api;

    readonly isLoggedIn  = signal<boolean>(false);
    readonly currentUser = signal<Me>({} as Me);

    private getHeaders() {
        return new HttpHeaders().set('Content-Type', 'application/json');
    };

    login(credentials: Login): Observable<Response<{ must_change_password: number }>> {
        const headers = this.getHeaders();
        return this._httpClient.post<Response<{ must_change_password: number }>>(`${this.url}auth/login`, credentials, { headers });
    };

    logout(): Observable<Response<{ message: string }>> {
        return this._httpClient.post<Response<{ message: string }>>(`${this.url}auth/logout`, null).pipe(
            tap(() => {
                this.isLoggedIn.set(false);
                this.currentUser.set({} as Me);
            })
        );
    };

    refreshToken(): Observable<Response<any>> {
        const headers = this.getHeaders();
        return this._httpClient.post<Response<any>>(`${this.url}auth/refresh`, null, { headers });
    };

    passwordChange(password: string): Observable<Response<{ update_password: any, message: string}>> {
        const headers = this.getHeaders();
        return this._httpClient.post<Response<{ update_password: any, message: string}>>(`${this.url}auth/password-changed`, { password }, { headers });
    };

    getMe(): Observable<Response<Me>> {
        if (this.currentUser().id) {
            this.isLoggedIn.set(true);
            return of({ status: 'success', data: this.currentUser() });
        }

        return this._httpClient.get<Response<Me>>(`${this.url}auth/me`).pipe(
            tap((res) => {
                this.currentUser.set(res.data)
                this.isLoggedIn.set(true);
            })
        );
    };
};