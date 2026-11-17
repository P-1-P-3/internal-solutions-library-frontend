import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { configService } from "../../../../core/config/config";
import { FunctionalAreas } from "../../../../shared/models/catalog-tables.interface";
import { Response } from "../../../../shared/models/req-res.interface";

@Injectable({
    providedIn: 'root'
})
export class FunctionalAreasService {
    private readonly _httpClient = inject(HttpClient);
    private readonly url         = configService.url_api;

    private getHeaders() {
        return new HttpHeaders().set('Content-Type', 'application/json');
    };

    getFunctionalAreas(): Observable<Response<FunctionalAreas[]>> {
        return this._httpClient.get<Response<FunctionalAreas[]>>(`${this.url}functional-areas`);
    };

    addFunctionalArea(functional_area: string): Observable<Response<any>> {
        const headers = this.getHeaders();

        return this._httpClient.post<Response<any>>(`${this.url}functional-areas`, { functional_area }, { headers });
    };

    updateFunctionalArea(id: string, functional_area: string): Observable<Response<any>> {
        const headers = this.getHeaders();

        return this._httpClient.put<Response<any>>(`${this.url}functional-areas/${id}`, { functional_area }, { headers });
    };

    deleteFunctionalArea(id: string): Observable<Response<any>> {
        return this._httpClient.delete<Response<any>>(`${this.url}functional-areas/${id}`);
    };
};