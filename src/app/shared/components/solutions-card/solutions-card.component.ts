import { Component, input } from "@angular/core";
import { CatalogSolution } from "../../../features/solutions/models/catalog-solution.interface";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-solutions-card',
    templateUrl: 'solutions-card.component.html',
    imports: [RouterLink],
})
export class SolutionsCardComponent {
    public solution = input<CatalogSolution>();
};