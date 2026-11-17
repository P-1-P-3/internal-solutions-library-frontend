import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { configService } from "../../../../core/config/config";
import { Categories } from "../../../../shared/models/catalog-tables.interface";
import { Response } from "../../../../shared/models/req-res.interface";

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private readonly _httpClient = inject(HttpClient);
    private readonly url         = configService.url_api;

    private getHeaders() {
        return new HttpHeaders().set('Content-Type', 'application/json');
    };

    getCategories(): Observable<Response<Categories[]>> {
        return this._httpClient.get<Response<Categories[]>>(`${this.url}categories`);
    };

    addCategory(category_type: string): Observable<Response<any>> {
        const headers = this.getHeaders();

        return this._httpClient.post<Response<any>>(`${this.url}categories`, { category_type }, { headers });
    };

    updateCategory(id: string, category_type: string): Observable<Response<any>> {
        const headers = this.getHeaders();

        return this._httpClient.put<Response<any>>(`${this.url}categories/${id}`, { category_type }, { headers });
    };

    deleteCategory(id: string): Observable<Response<any>> {
        return this._httpClient.delete<Response<any>>(`${this.url}categories/${id}`);
    };
};