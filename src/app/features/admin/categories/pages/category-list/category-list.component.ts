import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { TableComponent } from "../../../../../shared/components/table/table.component";
import { RowAction } from "../../../../../shared/components/table/table.interface";
import { Categories } from "../../../../../shared/models/catalog-tables.interface";
import { CategoriesService } from "../../service/category.service";
import { CategoryReportConfigService } from "../../service/category-report-config.service";
import { EditModalComponent } from "../../../components/edit-modal/edit-modal.component";

@Component({
    templateUrl: 'category-list.component.html',
    imports: [TableComponent, EditModalComponent]
})
export default class CategoryListComponent implements OnInit {
    private readonly _categoriesService           = inject(CategoriesService);
    private readonly _categoryReportConfigService = inject(CategoryReportConfigService);

    readonly categories   = signal<Categories[]>([]);
    readonly msgSuccess   = signal<string>('');
    readonly msgError     = signal<string>('');
    readonly catToEdit    = signal<Categories | null>(null);
    readonly isSavingEdit = signal(false);
    readonly editError    = signal('');

    readonly columns    = computed(() => this._categoryReportConfigService.columns);

    ngOnInit() {
        this.loadCat();
    };

    handleTableAction({ action, row }: RowAction<Categories>) {
        switch (action) {
            case 'delete_cat':
                this._categoriesService.deleteCategory(String(row.id)).subscribe({
                    next: (res) => this.categories.update((user) => user.filter((item) => item.id !== row.id)),
                    error: (err) => this.msgError.set(`Error al intentar eliminar la categoría ${row.type}. Por favor, inténtalo de nuevo más tarde o contacta a soporte si el problema persiste.`)
                });
                break;
            case 'edit_cat':
                this.catToEdit.set(row);
                this.editError.set('');
                this.msgError.set('');
                this.msgSuccess.set('');
                break;
            default:
                break;
        };
    };

    addCategory(value: string) {
        if (!value) return;

        this._categoriesService.addCategory(value.trim()).subscribe({
            next: (res) => this.categories.update((cat) => [{ id: res.data.insertId, type: value.trim() }, ...cat]),
            error: (err) => this.msgError.set(`Error al agregar la categoría ${value.trim()}. Por favor, inténtalo de nuevo más tarde o contacta a soporte si el problema persiste.`)
        })
    };

     saveCatEdit(value: string): void {
        const cat     = this.catToEdit();
        const catName = value.trim();

        if (!cat || !catName) return;
        if (catName === cat.type) {
            this.closeEditCatModal();
            return;
        }

        this.isSavingEdit.set(true);
        this.editError.set('');

        this._categoriesService.updateCategory(String(cat.id), catName).subscribe({
            next: () => {
                this.categories.update((cats) =>
                    cats.map((item) => item.id === cat.id ? { ...item, type: catName } : item)
                );
                this.isSavingEdit.set(false);
                this.closeEditCatModal();
                this.msgSuccess.set('Categoría actualizada correctamente.');
                this.msgError.set('');
            },
            error: () => {
                this.isSavingEdit.set(false);
                this.editError.set(`No se pudo actualizar la categoría ${cat.type}. Inténtalo nuevamente.`);
            }
        });
    };

    closeEditCatModal(): void {
        if (this.isSavingEdit()) return;

        this.catToEdit.set(null);
        this.editError.set('');
    };

    private loadCat() {
        this._categoriesService.getCategories().subscribe({
            next: (res) => this.categories.set(res.data),
            error: (err) => this.categories.set([])
        });
    };
};