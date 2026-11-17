import { Solution, Tags, Technologies } from "../../../shared/models/catalog-tables.interface";
import { PaginationRes } from "../../../shared/models/req-res.interface";

export interface CatalogSolution extends Solution {
    tags: Tags[];
    technologies: Technologies[];
};

export interface CatalogSolutionRes {
    items: CatalogSolution[];
    pagination: PaginationRes;
}