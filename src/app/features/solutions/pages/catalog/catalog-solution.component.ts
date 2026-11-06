import { AfterViewInit, Component, HostListener, inject, signal, OnInit } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { SolutionFilterSidebarComponent } from "../../components/solution-filter-sidebar/solution-filter-sidebar.component";
import { SolutionService } from "../../service/solution.service";
import { Categories, FunctionalAreas, Tags, Technologies } from "../../../../shared/models/catalog-tables.interface";
import { SolutionFilters } from "../../models/filter-criteria.interface";
import { SolutionResultGridComponent } from "../../components/solution-result-grid/solution-result-grid.component";
import { CatalogSolution } from "../../models/catalog-solution.interface";

@Component({
    selector: 'app-catalog-solution',
    templateUrl: 'catalog-solution.component.html',
    imports: [SolutionFilterSidebarComponent, SolutionResultGridComponent]
})
export default class CatalogSolutionComponent implements OnInit, AfterViewInit {
    private readonly _solutionService = inject(SolutionService);
    private readonly _document        = inject(DOCUMENT);
    
    private readonly _allSolutions = signal<CatalogSolution[]>([]);

    public filterTop    = signal<number | null>(null);
    public filterHeight = signal<number | null>(null);
    public categories   = signal<Categories[]>([]);
    public funcAreas    = signal<FunctionalAreas[]>([]);
    public technologies = signal<Technologies[]>([]);
    public tags         = signal<Tags[]>([]);
    public solutions    = signal<CatalogSolution[]>([]);

    ngOnInit() {
        this.getFilterData();
        this.getSolutions();
    };

    ngAfterViewInit() {
        this.updateFilterViewport();
    };

    @HostListener('window:scroll')
    @HostListener('window:resize')
    private updateFilterViewport() {
        const view = this._document.defaultView;
        const header = this._document.querySelector<HTMLElement>('app-header > div');

        if (!view || !header) return;
        
        if (!view.matchMedia('(min-width: 64rem)').matches) {
            this.filterTop.set(null);
            this.filterHeight.set(null);
            return;
        }

        const top = Math.max(16, header.getBoundingClientRect().bottom + 16);
        this.filterTop.set(top);
        this.filterHeight.set(Math.max(0, view.innerHeight - top - 16));
    }

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

        this._solutionService.getFunctionalAreas().subscribe({
            next: (res) => this.funcAreas.set(res?.data)
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
            || solutionFilters.functionalAreas.length > 0
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