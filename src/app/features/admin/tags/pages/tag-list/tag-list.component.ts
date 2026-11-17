import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { TagReportConfigService } from "../../service/tag-report-config.service";
import { Tags } from "../../../../../shared/models/catalog-tables.interface";
import { TagsService } from "../../service/tags.service";
import { TableComponent } from "../../../../../shared/components/table/table.component";
import { RowAction } from "../../../../../shared/components/table/table.interface";
import { EditModalComponent } from "../../../components/edit-modal/edit-modal.component";

@Component({
    templateUrl: 'tag-list.component.html',
    imports: [TableComponent, EditModalComponent]
})
export default class TagListComponent implements OnInit {
    private readonly _tagsService            = inject(TagsService);
    private readonly _tagReportConfigService = inject(TagReportConfigService);
    
    private timeController = 0;

    readonly tags         = signal<Tags[]>([]);
    readonly tagToEdit    = signal<Tags | null>(null);
    readonly isSavingEdit = signal(false);
    readonly editError    = signal('');
    readonly searchQuery  = signal('');
    readonly msgSuccess   = signal<string>('');
    readonly msgError     = signal<string>('');

    readonly columns      = computed(() => this._tagReportConfigService.columns);
    readonly filteredTags = computed(() => {
        const query = this.searchQuery().trim().toLowerCase();
        return this.tags().filter(({ tag }) => tag.toLowerCase().includes(query));
    });

    ngOnInit() {
        this.loadTags();
    };

    handleTableAction({ action, row }: RowAction<Tags>) {
        switch (action) {
            case 'delete_tag':
                this._tagsService.deleteTag(String(row.id)).subscribe({
                    next: (res) => this.tags.update((user) => user.filter((item) => item.id !== row.id)),
                    error: (err) => this.msgError.set(`Error al intentar eliminar la etiqueta ${row.tag}. Por favor, inténtalo de nuevo más tarde o contacta a soporte si el problema persiste.`)
                });
                break;
            case 'edit_tag':
                this.tagToEdit.set(row);
                this.editError.set('');
                this.msgError.set('');
                this.msgSuccess.set('');
                break;
            default:
                break;
        };
    };

    closeEditTagModal(): void {
        if (this.isSavingEdit()) return;

        this.tagToEdit.set(null);
        this.editError.set('');
    };

    saveTagEdit(value: string): void {
        const tag     = this.tagToEdit();
        const tagName = value.trim();

        if (!tag || !tagName) return;
        if (tagName === tag.tag) {
            this.closeEditTagModal();
            return;
        }

        this.isSavingEdit.set(true);
        this.editError.set('');

        this._tagsService.updateTag(String(tag.id), tagName).subscribe({
            next: () => {
                this.tags.update((tags) =>
                    tags.map((item) => item.id === tag.id ? { ...item, tag: tagName } : item)
                );
                this.isSavingEdit.set(false);
                this.closeEditTagModal();
                this.msgSuccess.set('Etiqueta actualizada correctamente.');
                this.msgError.set('');
            },
            error: () => {
                this.isSavingEdit.set(false);
                this.editError.set(`No se pudo actualizar la etiqueta ${tag.tag}. Inténtalo nuevamente.`);
            }
        });
    };

    addTag(value: string) {
        if (!value) return;
        
        this._tagsService.addTag(value.trim()).subscribe({
            next: (res) => this.tags.update((tags) => [{ id: res.data.insertId, tag: value.trim() }, ...tags]),
            error: (err) => this.msgError.set(`Error al agregar la etiqueta ${value.trim()}. Por favor, inténtalo de nuevo más tarde o contacta a soporte si el problema persiste.`)
        })
    };

    onSearchInput(value: string) {
        clearTimeout(this.timeController);
        this.timeController = setTimeout(() => this.searchQuery.set(value), 300);
        
    };

    private loadTags() {
        this._tagsService.getTags().subscribe({
            next: (res) => this.tags.set(res.data),
            error: (err) => this.tags.set([])
        });
    };
};