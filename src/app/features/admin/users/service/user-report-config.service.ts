import { Injectable } from "@angular/core";
import { TableColumn } from "../../../../shared/components/table/table.interface";
import { getNameInitials } from "../../../../shared/utils/name-initials";
import { User } from "../models/users.interface";

@Injectable({
    providedIn: 'root'
})
export class UserReportConfigService {
    public readonly columns: TableColumn<User>[] = [{
        id: 'user',
        title: 'Usuario',
        type: 'stacked',
        avatar: (user) => getNameInitials(user.full_name),
        primary: (user) => user.full_name,
        secondary: (user) => user.email
    }, {
        id: 'role',
        title: 'Rol',
        value: (user) => user.role.name
    }, {
        id: 'status',
        title: 'Estado',
        type: 'badge',
        value: (user) => user.is_active,
        format: (isActive) => isActive ? 'Activo' : 'Inactivo',
        class: (isActive) => isActive
            ? 'badge badge-soft badge-success'
            : 'badge badge-ghost'
    }, {
        id: 'last_login',
        title: 'Último acceso',
        type: 'date',
        dateFormat: 'dd MMM, hh:mm a',
        value: (user) => user.last_login
    }, {
        id: 'actions',
        title: 'Acciones',
        type: 'action',
        align: 'right',
        actions: [{
            id: 'edit_user',
            title: 'Editar',
            class: 'p-2 text-sm font-semibold text-primary transition hover:brightness-75 cursor-pointer'
        }, {
            id: 'delete_user',
            title: 'Eliminar',
            class: 'p-2 text-sm font-semibold text-slate-600 transition hover:text-red-700 cursor-pointer'
        }]
    }];
};