import { Injectable } from "@angular/core";
import { TableColumn } from "../../../../shared/components/table/table.interface";
import { Categories } from "../../../../shared/models/catalog-tables.interface";

@Injectable({
    providedIn: 'root'
})
export class CategoryReportConfigService {
    public readonly columns: TableColumn<Categories>[] = [{
        id: 'type',
        title: 'Categoría',
        type: 'text',
        class: 'font-semibold',
        value: (cat) => cat.type,
    }, {
        id: 'actions',
        title: 'Acciones',
        type: 'action',
        align: 'right',
        actions: [{
            id: 'edit_cat',
            title: 'Editar',
            class: 'p-2 text-sm font-semibold text-primary transition hover:brightness-75 cursor-pointer'
        }, {
            id: 'delete_cat',
            title: 'Eliminar',
            class: 'p-2 text-sm font-semibold text-slate-600 transition hover:text-red-700 cursor-pointer'
        }]
    }];
};