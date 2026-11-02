import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { configService } from "../../../core/config/config";
import { Response } from "../../../shared/models/req-res.interface";
import { DashboardStats } from "../../../shared/models/catalog-tables.interface";

@Injectable({
    providedIn: 'root'
})
export class DashboardStatsService {
    private readonly _httpClient = inject(HttpClient);
    private readonly url         = configService.url_api;
    private readonly headers : HttpHeaders | undefined;

    private getHeaders() {
        return new HttpHeaders().set('Content-Type', 'application/json');
    };

    getDashboardStats(): Observable<Response<DashboardStats>> {
        return this._httpClient.get<Response<DashboardStats>>(`${this.url}dashboard/stats`);
    };
};