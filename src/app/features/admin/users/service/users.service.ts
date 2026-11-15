import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { configService } from "../../../../core/config/config";
import { Response } from "../../../../shared/models/req-res.interface";
import { Roles } from "../../../../shared/models/catalog-tables.interface";
import { User, UserCrUp } from "../models/users.interface";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private readonly _httpClient = inject(HttpClient);
    private readonly url         = configService.url_api;

    private getHeaders() {
        return new HttpHeaders().set('Content-Type', 'application/json');
    };

    getUserById(id: string): Observable<Response<User>> {
        return this._httpClient.get<Response<User>>(`${this.url}users/${id}`);
    };

    getRoles(): Observable<Response<Roles[]>> {
        return this._httpClient.get<Response<Roles[]>>(`${this.url}roles`);
    };

    createUser(user: UserCrUp, password: string) {
        const headers = this.getHeaders();
        return this._httpClient.post<Response<User>>(`${this.url}users`, {...user, password}, { headers });
    };

    updateUser({id, ...user}: UserCrUp, password?: string) {
        const headers = this.getHeaders();
        const payload = {
            ...user,
            ...(password ? { password } : {})
        };
        
        return this._httpClient.put<Response<any>>(`${this.url}users/${id}`, payload, { headers });
    };
};