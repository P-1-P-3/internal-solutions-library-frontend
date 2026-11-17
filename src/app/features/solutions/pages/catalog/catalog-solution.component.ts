import { AfterViewInit, Component, HostListener, inject, signal, OnInit, effect } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { SolutionFilterSidebarComponent } from "../../components/solution-filter-sidebar/solution-filter-sidebar.component";
import { SolutionService } from "../../service/solution.service";
import { Categories, FunctionalAreas, Tags, Technologies } from "../../../../shared/models/catalog-tables.interface";
import { SolutionFilters } from "../../models/filter-criteria.interface";
import { SolutionResultGridComponent } from "../../components/solution-result-grid/solution-result-grid.component";
import { CatalogSolution } from "../../models/catalog-solution.interface";
import { ActivatedRoute } from "@angular/router";
import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";

@Component({
    selector: 'app-catalog-solution',
    templateUrl: 'catalog-solution.component.html',
    imports: [SolutionFilterSidebarComponent, SolutionResultGridComponent, PaginationComponent]
})
export default class CatalogSolutionComponent implements OnInit, AfterViewInit {
    private readonly _solutionService = inject(SolutionService);
    private readonly _activatedRoute  = inject(ActivatedRoute);
    private readonly _document        = inject(DOCUMENT);

    public currentPage  = signal<number>(1);
    public pageSize     = signal<number>(10);
    public totalItems   = signal<number>(0);

    public filterTop    = signal<number | null>(null);
    public filterHeight = signal<number | null>(null);

    public initFilterValue = signal<SolutionFilters>({
        search: '',
        categories: [],
        functionalAreas: [],
        technologies: [],
        tags: []
    });
    public activeFilters = signal<SolutionFilters>({
        search: '',
        categories: [],
        functionalAreas: [],
        technologies: [],
        tags: []
    });
    public loadError = signal('');

    public categories   = signal<Categories[]>([]);
    public funcAreas    = signal<FunctionalAreas[]>([]);
    public technologies = signal<Technologies[]>([]);
    public tags         = signal<Tags[]>([]);
    public solutions    = signal<CatalogSolution[]>([]);

    private readonly filtersInitialized = signal(false);

    private readonly paginatedEffect = effect((onCleanup) => {
        if (!this.filtersInitialized()) return;

        this.loadError.set('');
        const request = this._solutionService.getSolutions(
            { page: this.currentPage(), pageSize: this.pageSize() },
            this.activeFilters()
        ).subscribe({
            next: (res) => {
                this.solutions.set(res.data.items);
                this.totalItems.set(res.data.pagination.totalItems);
                this.loadError.set('');
            },
            error: () => {
                this.solutions.set([]);
                this.totalItems.set(0);
                this.loadError.set('No se pudieron cargar las soluciones. Inténtalo nuevamente.');
            }
        });

        onCleanup(() => request.unsubscribe());
    });

    ngOnInit() {
        this.getQueryParams();
        this.getFilterData();
        this.filtersInitialized.set(true);
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

    private getQueryParams() {
        const search     = this._activatedRoute.snapshot.queryParamMap.get('search');
        const category   = this._activatedRoute.snapshot.queryParamMap.get('category');
        const technology = this._activatedRoute.snapshot.queryParamMap.get('technology');
        const funcArea   = this._activatedRoute.snapshot.queryParamMap.get('functional_area');

        const filters: SolutionFilters = {
            search:          search ?? "",
            categories:      category !== null && Number.isFinite(Number(category)) ? [Number(category)] : [],
            technologies:    technology !== null && Number.isFinite(Number(technology)) ? [Number(technology)] : [],
            functionalAreas: funcArea !== null && Number.isFinite(Number(funcArea)) ? [Number(funcArea)] : [],
            tags: []
        };

        this.initFilterValue.set(filters);
        this.activeFilters.set(filters);
    };

    onFilterChange(filters: SolutionFilters): void {
        this.activeFilters.set({
            search: filters.search,
            categories: [...filters.categories],
            functionalAreas: [...filters.functionalAreas],
            technologies: [...filters.technologies],
            tags: [...filters.tags]
        });

        if (this.currentPage() !== 1) this.currentPage.set(1);
    };
};