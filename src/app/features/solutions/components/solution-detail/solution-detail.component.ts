import { Component, input } from "@angular/core";
import { CatalogSolution } from "../../models/catalog-solution.interface";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-solution-detail',
    templateUrl: 'solution-detail.component.html',
    imports: [DatePipe, RouterLink]
})
export class SolutionDetailComponent {
    public solution = input.required<CatalogSolution>();
};