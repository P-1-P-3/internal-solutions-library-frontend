import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SolutionsByCategory } from "../../models/catalog-tables.interface";

@Component({
    selector: 'app-category-stat',
    templateUrl: 'category-stat.component.html',
    imports: [RouterLink]
})
export class CategoryStatComponent {
    categories = input.required<SolutionsByCategory[]>();
};