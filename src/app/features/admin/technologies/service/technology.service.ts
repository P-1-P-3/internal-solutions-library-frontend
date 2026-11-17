import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { configService } from "../../../../core/config/config";
import { Technologies } from "../../../../shared/models/catalog-tables.interface";
import { Response } from "../../../../shared/models/req-res.interface";

@Injectable({
    providedIn: 'root'
})
export class TechnologiesService {
    private readonly _httpClient = inject(HttpClient);
    private readonly url         = configService.url_api;

    private getHeaders() {
        return new HttpHeaders().set('Content-Type', 'application/json');
    };

    getTechnologies(): Observable<Response<Technologies[]>> {
        return this._httpClient.get<Response<Technologies[]>>(`${this.url}technologies`);
    };

    addTechnology(technology_name: string): Observable<Response<any>> {
        const headers = this.getHeaders();

        return this._httpClient.post<Response<any>>(`${this.url}technologies`, { technology_name }, { headers });
    };

    updateTechnology(id: string, technology_name: string): Observable<Response<any>> {
        const headers = this.getHeaders();

        return this._httpClient.put<Response<any>>(`${this.url}technologies/${id}`, { technology_name }, { headers });
    };

    deleteTechnology(id: string): Observable<Response<any>> {
        return this._httpClient.delete<Response<any>>(`${this.url}technologies/${id}`);
    };
};