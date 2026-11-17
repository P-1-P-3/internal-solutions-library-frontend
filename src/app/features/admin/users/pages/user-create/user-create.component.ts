import { Component, computed, signal, OnInit, inject } from "@angular/core";
import { email, form, maxLength, minLength, required, validate } from "@angular/forms/signals";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { BasicInfoSectionComponent } from "../../components/basic-info-section/basic-info-section.component";
import { User, UserCrUp, userModel, UserModel } from "../../models/users.interface";
import { crossPasswordValidator } from "../../../../../shared/utils/custom.validator";
import { AccessSecuritySectionComponent } from "../../components/access-security-section/access-security-section.component";
import { Roles } from "../../../../../shared/models/catalog-tables.interface";
import { UsersService } from "../../service/users.service";
import { MetadataSectionComponent } from "../../components/metadata-section/metadata-section.component";

@Component({
    templateUrl: 'user-create.component.html',
    imports: [RouterLink, BasicInfoSectionComponent, AccessSecuritySectionComponent, MetadataSectionComponent]
})
export default class UserCreateComponent implements OnInit {
    private readonly _usersService   = inject(UsersService);
    private readonly _activatedRoute = inject(ActivatedRoute);
    private readonly _router         = inject(Router);

    private readonly userID = signal<string | null>(null);

    readonly action = computed(() => this.userID() ? 'edit' : 'create');
    readonly userId = computed(() => this.userID());

    readonly roles       = signal<Roles[]>([]);
    readonly metadata    = signal<User>({} as User);
    readonly userSuccess = signal('');
    readonly userError   = signal('');

    readonly model = signal<UserModel>(userModel);

    readonly userForm = form(this.model, (path) => {
        const message = {
            required: 'Este campo es obligatorio',
        };

        required(path.basicInfo.fullName, { message: message.required });
        required(path.basicInfo.email, { message: message.required });
        required(path.accessAndSecurity.role, { message: message.required });
        required(path.accessAndSecurity.password, {
            message: message.required,
            when: () => this.action() === 'create'
        });
        required(path.accessAndSecurity.confirm_password, {
            message: message.required,
            when: () => this.action() === 'create' || !!this.model().accessAndSecurity.password
        });

        email(path.basicInfo.email, { message: 'Dirección de correo electrónico invalido' });

        maxLength(path.basicInfo.fullName, 80, { message: 'Máximo 80 caracteres' });
        maxLength(path.basicInfo.email, 150, { message: 'Máximo 150 caracteres' });
        
        minLength(path.accessAndSecurity.password, 8, { message: 'La contraseña debe tener al menos 8 caracteres' });

        validate(path.accessAndSecurity.confirm_password, (ctx) =>
            crossPasswordValidator(ctx, ctx.valueOf(path.accessAndSecurity.password))
        );
    });

    ngOnInit() {
        this.loadLists();
        this.loadSolutionFromRoute();
    };

    executeAction(action: 'edit' | 'create') {
        this.userForm().markAsTouched();

        if (this.userForm().invalid()) return;

        console.log(this.model());
        if(action === 'create') {
            this.createUser();
        } else if (action  === 'edit') {
            this.updateUser();
        }
        
    };

    onCancel() {
        void this._router.navigate(['/admin/users']);
    };

    private createUser() {
        const accessAndSecurity = this.model().accessAndSecurity;
        const basicInfo = this.model().basicInfo;

        const userToCreate: UserCrUp = {
            id: '',
            full_name: basicInfo.fullName,
            email: basicInfo.email,
            role: accessAndSecurity.role!,
            is_active: accessAndSecurity.is_active,
            must_change_password: accessAndSecurity.must_change_password
        };

        this._usersService.createUser(userToCreate, accessAndSecurity.password).subscribe({
            next: (res) => {
                this.userSuccess.set('El usuario se creo exitosamente.');
                this.userError.set('');
                this.model.set(userModel);
                this.userForm().reset();
            },
            error: () => this.userError.set('No se pudo crear el usuario. Inténtalo nuevamente.')
        });
    };

    private updateUser() {
        const accessAndSecurity = this.model().accessAndSecurity;
        const basicInfo = this.model().basicInfo;

        const userToUpdate: UserCrUp = {
            id: this.userID()!,
            full_name: basicInfo.fullName,
            email: basicInfo.email,
            role: accessAndSecurity.role!,
            is_active: accessAndSecurity.is_active,
            must_change_password: accessAndSecurity.must_change_password
        };

        const password = accessAndSecurity.password ?? undefined;

        this._usersService.updateUser(userToUpdate, password).subscribe({
            next: (res) => {
                this.userSuccess.set('El usuario se actualizado correctamente.')
                this.userError.set('');
            },
            error: (err) => this.userError.set(err.error?.error?.message ?? 'No se pudo actualizar el usuario. Inténtalo nuevamente.')
        });
    };

    private loadSolutionFromRoute() {
        this.userID.set(this._activatedRoute.snapshot.paramMap.get('user_id'));
        
        if(!this.userID()) return;

        this._usersService.getUserById(this.userID()!).subscribe({
            next: (res) => {
                this.model.set({
                    basicInfo: {
                        fullName: res.data.full_name,
                        email: res.data.email
                    },
                    accessAndSecurity: {
                        role: res.data.role.id,
                        is_active: res.data.is_active,
                        must_change_password: res.data.must_change_password,
                        password: '',
                        confirm_password: ''
                    }
                });
                this.metadata.set({ ...res.data });
            },
            error: (err) => this._router.navigate(['/'])
        })
    };

    private loadLists() {
        this._usersService.getRoles().subscribe({
            next: (res) => this.roles.set(res.data),
            error: (err) => this.roles.set([])
        });
    };
};