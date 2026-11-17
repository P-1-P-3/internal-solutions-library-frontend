import { Injectable } from "@angular/core";
import { TableColumn } from "../../../../shared/components/table/table.interface";
import { FunctionalAreas } from "../../../../shared/models/catalog-tables.interface";

@Injectable({
    providedIn: 'root'
})
export class FunctionalAreaReportConfigService {
    public readonly columns: TableColumn<FunctionalAreas>[] = [{
        id: 'functional_area',
        title: 'Área funcional',
        type: 'text',
        class: 'font-semibold',
        value: (fnArea) => fnArea.functional_area,
    }, {
        id: 'actions',
        title: 'Acciones',
        type: 'action',
        align: 'right',
        actions: [{
            id: 'edit_fnarea',
            title: 'Editar',
            class: 'p-2 text-sm font-semibold text-primary transition hover:brightness-75 cursor-pointer'
        }, {
            id: 'delete_fnarea',
            title: 'Eliminar',
            class: 'p-2 text-sm font-semibold text-slate-600 transition hover:text-red-700 cursor-pointer'
        }]
    }];
};