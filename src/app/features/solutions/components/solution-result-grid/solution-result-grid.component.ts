import { Component, input } from "@angular/core";
import { SolutionsCardComponent } from "../../../../shared/components/solutions-card/solutions-card.component";
import { CatalogSolution } from "../../models/catalog-solution.interface";

@Component({
    selector: 'app-solution-result-grid',
    templateUrl: 'solution-result-grid.component.html',
    imports: [SolutionsCardComponent]
})
export class SolutionResultGridComponent {
    public solutions = input<CatalogSolution[]>([]);
};