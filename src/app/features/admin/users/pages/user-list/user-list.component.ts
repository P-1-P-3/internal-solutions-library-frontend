import { Component, inject, signal, OnInit, computed } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { TableComponent } from "../../../../../shared/components/table/table.component";
import { RowAction } from "../../../../../shared/components/table/table.interface";
import { User } from "../../models/users.interface";
import { UsersService } from "../../service/users.service";
import { UserReportConfigService } from "../../service/user-report-config.service";

@Component({
    templateUrl: 'user-list.component.html',
    imports: [TableComponent, RouterLink]
})
export default class UserListComponent implements OnInit {
    private readonly _usersService            = inject(UsersService);
    private readonly _userReportConfigService = inject(UserReportConfigService);
    private readonly _router                  = inject(Router);

    private timeController = 0;

    readonly users       = signal<User[]>([]);
    readonly searchQuery = signal('');
    readonly msgSuccess  = signal<string>('');
    readonly msgError    = signal<string>('');

    readonly columns     = computed(() => this._userReportConfigService.columns);
    readonly filteredUsers = computed(() => {
        const query = this.searchQuery().trim().toLowerCase();
        return this.users().filter(({ full_name, email, role }) => 
            full_name.toLowerCase().includes(query) ||
            email.toLowerCase().includes(query) ||
            role.name.toLowerCase().includes(query)
        );
    });

    ngOnInit() {
        this.loadUsers();
    };

    handleTableAction({ action, row }: RowAction<User>) {
        switch (action) {
            case 'edit_user':
                void this._router.navigate(['/admin/users', row.id]);
                break;
            case 'delete_user':
                this._usersService.deleteUser(row.id).subscribe({
                    next: (res) => this.users.update((user) => user.filter((item) => item.id !== row.id)),
                    error: (err) => this.msgError.set(`Error al intentar eliminar el usuario ${row.full_name}. Por favor, inténtalo de nuevo más tarde o contacta a soporte si el problema persiste.`)
                });
                break;
        
            default:
                break;
        };
    };

    onSearchInput(value: string) {
        clearTimeout(this.timeController);
        this.timeController = setTimeout(() => this.searchQuery.set(value), 300);
    };

    private loadUsers() {
        this._usersService.getUsers().subscribe({
            next: (res) => {
                this.users.set(res.data);
            },
            error: (err) => this.users.set([])
        });
    };
};