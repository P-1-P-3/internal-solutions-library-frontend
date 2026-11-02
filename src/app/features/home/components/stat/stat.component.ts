import { Component, input } from "@angular/core";

@Component({
    selector: 'app-stat-home',
    templateUrl: 'stat.component.html',
})
export class StatComponent {
    solutionsLength    = input<number>(0);
    categoriesLength   = input<number>(0);
    technologiesLength = input<number>(0);
};