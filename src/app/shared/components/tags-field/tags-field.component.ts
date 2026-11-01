import { Component, computed, input, output, signal } from "@angular/core";
import { Tags } from "../../models/catalog-tables.interface";

@Component({
    selector: 'app-tags-field',
    templateUrl: 'tags-field.component.html'
})
export class TagsFieldComponent {
    public options     = input<Tags[]>([]);
    public selectedIds = input<number[]>([]);
    
    selectedIdsChange = output<number[]>();

    public query  = signal('');
    public isOpen = signal(false);

    public matches = computed(() => {
        const q = this.query().toLowerCase().trim();
        const available = this.options();
        const currentTags = this.selectedIds();

        return available.filter((tag) => 
            !currentTags.includes(tag.id) && tag.tag.toLowerCase().includes(q)
        );
    });

    selectTag(tag: Tags) {
        this.selectedIdsChange.emit([...this.selectedIds(), tag.id]);
        this.query.set('');
        this.isOpen.set(false);
    };

    removeTag(tagRemove: number) {
        const currtenTags = this.selectedIds();
        this.selectedIdsChange.emit(currtenTags.filter(tag => tag !== tagRemove));
    };

    onSearchTags(value: string) {
        this.query.set(value);
        this.isOpen.set(true);
    };

    onBlur() {
        setTimeout(() => this.isOpen.set(false), 200);
    };
};