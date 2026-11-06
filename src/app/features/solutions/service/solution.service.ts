import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { configService } from "../../../core/config/config";
import { Categories, FunctionalAreas, Solution, Tags, Technologies } from "../../../shared/models/catalog-tables.interface";
import { Observable } from "rxjs";
import { Pagination, Response } from "../../../shared/models/req-res.interface";
import { CatalogSolution } from "../models/catalog-solution.interface";
import { SolutionFilters, SolutionSort } from "../models/filter-criteria.interface";
import { CreateSolution } from "../models/contribute.interface";

@Injectable({
    providedIn: 'root'
})
export class SolutionService {
    private readonly _httpClient = inject(HttpClient);
    private readonly url         = configService.url_api;
    private readonly headers : HttpHeaders | undefined;

    private getHeaders() {
        return new HttpHeaders().set('Content-Type', 'application/json');
    };

    getSolution(solutionId: string): Observable<Response<CatalogSolution>> {
        return this._httpClient.get<Response<CatalogSolution>>(`${this.url}reusable-solutions/${solutionId}`);
    };

    getSolutions(pagination: Pagination, filters?: SolutionFilters, sort?: SolutionSort): Observable<Response<CatalogSolution[]>> {
        const params = { filters, pagination, sort };
        const headers = this.getHeaders();
        return this._httpClient.post<Response<CatalogSolution[]>>(`${this.url}reusable-solutions/search`, params, { headers });
    };

    getCategories(): Observable<Response<Categories[]>> {
        return this._httpClient.get<Response<Categories[]>>(`${this.url}categories`);
    };

    getFunctionalAreas(): Observable<Response<FunctionalAreas[]>> {
        return this._httpClient.get<Response<FunctionalAreas[]>>(`${this.url}functional-areas`);
    };

    getTechnologies(): Observable<Response<Technologies[]>> {
        return this._httpClient.get<Response<Technologies[]>>(`${this.url}technologies`);
    };

    getTags(): Observable<Response<Tags[]>> {
        return this._httpClient.get<Response<Tags[]>>(`${this.url}tags`);
    };

    createSolution(solutions: CreateSolution): Observable<Response<Solution>> {
        const headers = this.getHeaders();
        return this._httpClient.post<Response<Solution>>(`${this.url}reusable-solutions`, { ...solutions }, { headers: headers });
    };
};