import { Component, input, output } from "@angular/core";

@Component({
    selector: 'app-search-solutions',
    templateUrl: 'search-solutions.component.html',
})
export class SearchSolutionsComponent {
    placeholder = input<string>('Buscar soluciones');
    value       = input<string>('');

    searchValue = output<string>();

    onSearch(value: string) {
        const search = value.toLowerCase().trim();
        this.searchValue.emit(search);
    };
};