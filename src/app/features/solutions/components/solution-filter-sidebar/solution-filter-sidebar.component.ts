import { Component, effect, input, output, signal, untracked } from "@angular/core";
import { SolutionFilters } from "../../models/filter-criteria.interface";
import { Categories, FunctionalAreas, Tags, Technologies } from "../../../../shared/models/catalog-tables.interface";
import { ComboboxComponent } from "../../../../shared/components/combobox/combobox.component";

@Component({
    selector: 'app-solution-filter-sidebar',
    templateUrl: 'solution-filter-sidebar.component.html',
    imports: [ComboboxComponent]
})
export class SolutionFilterSidebarComponent {
    public initFilterValue = input<SolutionFilters>();
    public categories      = input<Categories[]>([]);
    public fncAreas        = input<FunctionalAreas[]>([]);
    public technologies    = input<Technologies[]>([]);
    public tags            = input<Tags[]>([]);

    filtersChange = output<SolutionFilters>();

    public filters = signal<SolutionFilters>({
        search:          '',
        categories:      [],
        functionalAreas: [],
        technologies:    [],
        tags:            []
    });

    private readonly initFilterEffect = effect(() => {
        const initial = this.initFilterValue();
        if (!initial) return;

        untracked(() => {
            this.filters.set({
                search: initial.search ?? '',
                categories: [...(initial.categories ?? [])],
                functionalAreas: [...(initial.functionalAreas ?? [])],
                technologies: [...(initial.technologies ?? [])],
                tags: [...(initial.tags ?? [])]
            });
        });
    });

    private timeController = 0;

    tagLabel = (tag: Tags) => tag.tag;

    onSearchInput(search: string): void {
        clearTimeout(this.timeController);
        this.timeController = setTimeout(() => this.updateFilters({ ...this.filters(), search }), 500);
    };

    onSelectedIdsTagsChange(selectedIds: number[]) {
        this.filters().tags = selectedIds;
        this.filtersChange.emit(this.filters());
    };

    onCheckboxChange(
        group: 'categories' | 'functionalAreas' | 'technologies',
        value: number,
        event: Event
    ): void {
        const checked       = (event.target as HTMLInputElement).checked;
        const currentValues = this.filters()[group];
        const values = checked
            ? [...new Set([...currentValues, value])]
            : currentValues.filter(item => item !== value);

        this.updateFilters({ ...this.filters(), [group]: values });
    };

    private updateFilters(filters: SolutionFilters): void {
        this.filters.set(filters);
        this.filtersChange.emit(filters);
    };
};