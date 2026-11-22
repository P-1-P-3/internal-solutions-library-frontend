import { Component, input, output } from "@angular/core";
import { CatalogSolution } from "../../../features/solutions/models/catalog-solution.interface";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-solutions-card',
    templateUrl: 'solutions-card.component.html',
    imports: [RouterLink],
})
export class SolutionsCardComponent {
    public solution = input.required<CatalogSolution>();
    public showDelete = input<boolean>(false);

    deleteRequested = output<string>();
};