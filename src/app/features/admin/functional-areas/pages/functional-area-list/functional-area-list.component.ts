import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { FunctionalAreasService } from "../../service/functional-area.service";
import { FunctionalAreaReportConfigService } from "../../service/functional-area-report-config.service";
import { FunctionalAreas } from "../../../../../shared/models/catalog-tables.interface";
import { RowAction } from "../../../../../shared/components/table/table.interface";
import { TableComponent } from "../../../../../shared/components/table/table.component";
import { EditModalComponent } from "../../../components/edit-modal/edit-modal.component";

@Component({
    templateUrl: 'functional-area-list.component.html',
    imports: [TableComponent, EditModalComponent]
})
export default class FunctionalAreaListComponent implements OnInit {
    private readonly _functionalAreasService            = inject(FunctionalAreasService);
    private readonly _functionalAreaReportConfigService = inject(FunctionalAreaReportConfigService);

    readonly functionalAreas = signal<FunctionalAreas[]>([]);
    readonly msgSuccess      = signal<string>('');
    readonly msgError        = signal<string>('');
    readonly fnAreaToEdit    = signal<FunctionalAreas | null>(null);
    readonly isSavingEdit    = signal(false);
    readonly editError       = signal('');

    readonly columns    = computed(() => this._functionalAreaReportConfigService.columns);

    ngOnInit() {
        this.loadCat();
    };

    handleTableAction({ action, row }: RowAction<FunctionalAreas>) {
        switch (action) {
            case 'delete_fnarea':
                this._functionalAreasService.deleteFunctionalArea(String(row.id)).subscribe({
                    next: (res) => this.functionalAreas.update((user) => user.filter((item) => item.id !== row.id)),
                    error: (err) => this.msgError.set(`Error al intentar eliminar el área funcional ${row.functional_area}. Por favor, inténtalo de nuevo más tarde o contacta a soporte si el problema persiste.`)
                });
                break;
            case 'edit_fnarea':
                this.fnAreaToEdit.set(row);
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

        this._functionalAreasService.addFunctionalArea(value.trim()).subscribe({
            next: (res) => this.functionalAreas.update((tech) => [{ id: res.data.insertId, functional_area: value.trim() }, ...tech]),
            error: (err) => this.msgError.set(`Error al agregar el área funcional ${value.trim()}. Por favor, inténtalo de nuevo más tarde o contacta a soporte si el problema persiste.`)
        })
    };

    saveFnAreaEdit(value: string): void {
        const fnArea     = this.fnAreaToEdit();
        const fnAreaName = value.trim();

        if (!fnArea || !fnAreaName) return;
        if (fnAreaName === fnArea.functional_area) {
            this.closeEditFnAreaModal();
            return;
        }

        this.isSavingEdit.set(true);
        this.editError.set('');

        this._functionalAreasService.updateFunctionalArea(String(fnArea.id), fnAreaName).subscribe({
            next: () => {
                this.functionalAreas.update((fnAreas) =>
                    fnAreas.map((item) => item.id === fnArea.id ? { ...item, functional_area: fnAreaName } : item)
                );
                this.isSavingEdit.set(false);
                this.closeEditFnAreaModal();
                this.msgSuccess.set('Área funcional actualizada correctamente.');
                this.msgError.set('');
            },
            error: () => {
                this.isSavingEdit.set(false);
                this.editError.set(`No se pudo actualizar el área funcional ${fnArea.functional_area}. Inténtalo nuevamente.`);
            }
        });
    };

    closeEditFnAreaModal(): void {
        if (this.isSavingEdit()) return;

        this.fnAreaToEdit.set(null);
        this.editError.set('');
    };

    private loadCat() {
        this._functionalAreasService.getFunctionalAreas().subscribe({
            next: (res) => this.functionalAreas.set(res.data),
            error: (err) => this.functionalAreas.set([])
        });
    };
};