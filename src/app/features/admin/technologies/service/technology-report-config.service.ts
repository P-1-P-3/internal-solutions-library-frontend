import { Injectable } from "@angular/core";
import { TableColumn } from "../../../../shared/components/table/table.interface";
import { Technologies } from "../../../../shared/models/catalog-tables.interface";

@Injectable({
    providedIn: 'root'
})
export class TechnologyReportConfigService {
    public readonly columns: TableColumn<Technologies>[] = [{
        id: 'technology',
        title: 'Tecnología',
        type: 'text',
        class: 'font-semibold',
        value: (tech) => tech.technology,
    }, {
        id: 'actions',
        title: 'Acciones',
        type: 'action',
        align: 'right',
        actions: [{
            id: 'edit_tech',
            title: 'Editar',
            class: 'p-2 text-sm font-semibold text-primary transition hover:brightness-75 cursor-pointer'
        }, {
            id: 'delete_tech',
            title: 'Eliminar',
            class: 'p-2 text-sm font-semibold text-slate-600 transition hover:text-red-700 cursor-pointer'
        }]
    }];
};