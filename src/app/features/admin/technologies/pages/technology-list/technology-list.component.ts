import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { TableComponent } from "../../../../../shared/components/table/table.component";
import { TechnologiesService } from "../../service/technology.service";
import { TechnologyReportConfigService } from "../../service/technology-report-config.service";
import { Technologies } from "../../../../../shared/models/catalog-tables.interface";
import { RowAction } from "../../../../../shared/components/table/table.interface";
import { EditModalComponent } from "../../../components/edit-modal/edit-modal.component";

@Component({
    templateUrl: 'technology-list.component.html',
    imports: [TableComponent, EditModalComponent]
})
export default class TechnologyListComponent implements OnInit {
    private readonly _technologiesService           = inject(TechnologiesService);
    private readonly _technologyReportConfigService = inject(TechnologyReportConfigService);

    readonly technologies = signal<Technologies[]>([]);
    readonly msgSuccess   = signal<string>('');
    readonly msgError     = signal<string>('');
    readonly techToEdit   = signal<Technologies | null>(null);
    readonly isSavingEdit = signal(false);
    readonly editError    = signal('');

    readonly columns      = computed(() => this._technologyReportConfigService.columns);

    ngOnInit() {
        this.loadTech();
    };

    handleTableAction({ action, row }: RowAction<Technologies>) {
        switch (action) {
            case 'delete_tech':
                this._technologiesService.deleteTechnology(String(row.id)).subscribe({
                    next: (res) => this.technologies.update((user) => user.filter((item) => item.id !== row.id)),
                    error: (err) => this.msgError.set(`Error al intentar eliminar el registro ${row.technology}. Por favor, inténtalo de nuevo más tarde o contacta a soporte si el problema persiste.`)
                });
                break;
            case 'edit_tech':
                this.techToEdit.set(row);
                this.editError.set('');
                this.msgError.set('');
                this.msgSuccess.set('');
                break;
            default:
                break;
        };
    };

    addTag(value: string) {
        if (!value) return;
        
        this._technologiesService.addTechnology(value.trim()).subscribe({
            next: (res) => this.technologies.update((tech) => [{ id: res.data.insertId, technology: value.trim() }, ...tech]),
            error: (err) => this.msgError.set(`Error al agregar el registro ${value.trim()}. Por favor, inténtalo de nuevo más tarde o contacta a soporte si el problema persiste.`)
        })
    };

    saveTagEdit(value: string): void {
        const tech     = this.techToEdit();
        const techName = value.trim();

        if (!tech || !techName) return;
        if (techName === tech.technology) {
            this.closeEditTagModal();
            return;
        }

        this.isSavingEdit.set(true);
        this.editError.set('');

        this._technologiesService.updateTechnology(String(tech.id), techName).subscribe({
            next: () => {
                this.technologies.update((techs) =>
                    techs.map((item) => item.id === tech.id ? { ...item, technology: techName } : item)
                );
                this.isSavingEdit.set(false);
                this.closeEditTagModal();
                this.msgSuccess.set('Tecnología actualizada correctamente.');
                this.msgError.set('');
            },
            error: () => {
                this.isSavingEdit.set(false);
                this.editError.set(`No se pudo actualizar la tecnología ${tech.technology}. Inténtalo nuevamente.`);
            }
        });
    };

    closeEditTagModal(): void {
        if (this.isSavingEdit()) return;

        this.techToEdit.set(null);
        this.editError.set('');
    };

    private loadTech() {
        this._technologiesService.getTechnologies().subscribe({
            next: (res) => this.technologies.set(res.data),
            error: (err) => this.technologies.set([])
        });
    };
};