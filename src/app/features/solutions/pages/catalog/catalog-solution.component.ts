import { Component, inject, signal, OnInit } from "@angular/core";
import { SolutionFilterSidebarComponent } from "../../components/solution-filter-sidebar/solution-filter-sidebar.component";
import { SolutionService } from "../../service/solution.service";
import { Categories, Tags, Technologies } from "../../../../shared/models/catalog-tables.interface";
import { SolutionFilters } from "../../models/filter-criteria.interface";
import { SolutionResultGridComponent } from "../../components/solution-result-grid/solution-result-grid.component";
import { CatalogSolution } from "../../models/catalog-solution.interface";

@Component({
    selector: 'app-catalog-solution',
    templateUrl: 'catalog-solution.component.html',
    imports: [SolutionFilterSidebarComponent, SolutionResultGridComponent]
})
export default class CatalogSolutionComponent implements OnInit {
    private readonly _solutionService = inject(SolutionService);
    
    private readonly _allSolutions = signal<CatalogSolution[]>([]);

    public categories   = signal<Categories[]>([]);
    public technologies = signal<Technologies[]>([]);
    public tags         = signal<Tags[]>([]);
    public solutions    = signal<CatalogSolution[]>([]);

    ngOnInit() {
        this.getFilterData();
        this.getSolutions();
    };

    private getSolutions() {
        this._solutionService.getSolutions({ limit: 10, offset: 0}).subscribe({
            next: (res) => {
                this._allSolutions.set(res.data);
                this.solutions.set(res.data);
            }
        });
    };

    private getFilterData() {
        this._solutionService.getCategories().subscribe({
            next: (res) => this.categories.set(res?.data)
        });

        this._solutionService.getTechnologies().subscribe({
            next: (res) => this.technologies.set(res?.data)
        });

        this._solutionService.getTags().subscribe({
            next: (res) => this.tags.set(res?.data)
        });
    };

    onFilterChange(solutionFilters: SolutionFilters) {
        const hasActiveFilters = Boolean(solutionFilters.title.trim())
            || solutionFilters.categories.length > 0
            || solutionFilters.funcAreas.length > 0
            || solutionFilters.technologies.length > 0
            || solutionFilters.tags.length > 0;

        if (!hasActiveFilters) {
            this.solutions.set(this._allSolutions());
            return;
        }

        this._solutionService.getSolutions({ limit: 10, offset: 0 }, solutionFilters).subscribe({
            next: (res) => this.solutions.set(res.data)
        });
    };
};