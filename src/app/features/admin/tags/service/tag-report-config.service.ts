import { Injectable } from "@angular/core";
import { TableColumn } from "../../../../shared/components/table/table.interface";
import { Tags } from "../../../../shared/models/catalog-tables.interface";

@Injectable({
    providedIn: 'root'
})
export class TagReportConfigService {
    public readonly columns: TableColumn<Tags>[] = [{
        id: 'tag',
        title: 'Etiqueta',
        type: 'text',
        class: 'font-semibold',
        value: (tag) => tag.tag,
    }, {
        id: 'actions',
        title: 'Acciones',
        type: 'action',
        align: 'right',
        actions: [{
            id: 'edit_tag',
            title: 'Editar',
            class: 'p-2 text-sm font-semibold text-primary transition hover:brightness-75 cursor-pointer'
        }, {
            id: 'delete_tag',
            title: 'Eliminar',
            class: 'p-2 text-sm font-semibold text-slate-600 transition hover:text-red-700 cursor-pointer'
        }]
    }];
};