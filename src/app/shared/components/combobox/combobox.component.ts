import { Component, computed, input, output, signal } from "@angular/core";

interface IdentifiableOption {
    id: number;
};

@Component({
    selector: 'app-combobox',
    templateUrl: 'combobox.component.html'
})
export class ComboboxComponent<T extends IdentifiableOption> {
    public label       = input<string>('');
    public placeholder = input<string>('');
    public valuePrefix = input<string>('');
    public options     = input<T[]>([]);
    public selectedIds = input<number[]>([]);
    public displayWith = input.required<(option: T) => string>();
    
    selectedIdsChange = output<number[]>();

    public query  = signal('');
    public isOpen = signal(false);

    public matches = computed(() => {
        const query = this.query().toLowerCase().trim();
        const selectedIds = this.selectedIds();

        return this.options().filter(option =>
            !selectedIds.includes(option.id) &&
            this.displayWith()(option).toLowerCase().includes(query)
        );
    });

    getOptionLabel(option: T): string {
        return this.displayWith()(option);
    }

    selectOption(option: T) {
        this.selectedIdsChange.emit([...this.selectedIds(), option.id]);
        this.query.set('');
        this.isOpen.set(false);
    }

    removeOption(id: number) {
        this.selectedIdsChange.emit(
            this.selectedIds().filter(selectedId => selectedId !== id)
        );
    }

    onSearchOption(value: string) {
        this.query.set(value);
        this.isOpen.set(true);
    };

    onBlur() {
        setTimeout(() => this.isOpen.set(false), 200);
    };
};