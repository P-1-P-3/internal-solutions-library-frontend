import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { configService } from "../../../../core/config/config";
import { Tags } from "../../../../shared/models/catalog-tables.interface";
import { Response } from "../../../../shared/models/req-res.interface";

@Injectable({
    providedIn: 'root'
})
export class TagsService {
    private readonly _httpClient = inject(HttpClient);
    private readonly url         = configService.url_api;

    private getHeaders() {
        return new HttpHeaders().set('Content-Type', 'application/json');
    };

    getTags(): Observable<Response<Tags[]>> {
        return this._httpClient.get<Response<Tags[]>>(`${this.url}tags`);
    };

    addTag(tag_name: string): Observable<Response<any>> {
        const headers = this.getHeaders();

        return this._httpClient.post<Response<any>>(`${this.url}tags`, { tag_name }, { headers });
    };

    updateTag(id: string, tag_name: string): Observable<Response<any>> {
        const headers = this.getHeaders();

        return this._httpClient.put<Response<any>>(`${this.url}tags/${id}`, { tag_name }, { headers });
    };

    deleteTag(id: string): Observable<Response<any>> {
        return this._httpClient.delete<Response<any>>(`${this.url}tags/${id}`);
    };
};