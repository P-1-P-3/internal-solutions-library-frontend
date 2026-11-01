import { Component, input, output } from "@angular/core";
import { SolutionFilters } from "../../models/filter-criteria.interface";
import { Categories, FunctionalAreas, Tags, Technologies } from "../../../../shared/models/catalog-tables.interface";
import { TagsFieldComponent } from "../../../../shared/components/tags-field/tags-field.component";

@Component({
    selector: 'app-solution-filter-sidebar',
    templateUrl: 'solution-filter-sidebar.component.html',
    imports: [TagsFieldComponent]
})
export class SolutionFilterSidebarComponent {
    public categories   = input<Categories[]>([]);
    public fncAreas     = input<FunctionalAreas[]>([]);
    public technologies = input<Technologies[]>([]);
    public tags         = input<Tags[]>([]);

    filtersChange = output<SolutionFilters>();

    public filters: SolutionFilters = {
        title:        '',
        categories:   [],
        funcAreas:    [],
        technologies: [],
        tags:         []
    };

    private timeController = 0;

    onTitleInput(title: string): void {
        clearTimeout(this.timeController);
        this.timeController = setTimeout(() => this.updateFilters({ ...this.filters, title }), 500);
    };

    onSelectedIdsTagsChange(selectedIds: number[]) {
        this.filters.tags = selectedIds;
        this.filtersChange.emit(this.filters);
    };

    onCheckboxChange(
        group: 'categories' | 'funcAreas' | 'technologies',
        value: number,
        event: Event
    ): void {
        const checked       = (event.target as HTMLInputElement).checked;
        const currentValues = this.filters[group];
        const values = checked
            ? [...new Set([...currentValues, value])]
            : currentValues.filter(item => item !== value);

        this.updateFilters({ ...this.filters, [group]: values });
    };

    private updateFilters(filters: SolutionFilters): void {
        this.filters = filters;
        this.filtersChange.emit(filters);
    };
};