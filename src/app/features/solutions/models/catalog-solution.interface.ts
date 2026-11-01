import { Solution, Tags, Technologies } from "../../../shared/models/catalog-tables.interface";

export interface CatalogSolution extends Solution {
    tags: Tags[];
    technologies: Technologies[];
};