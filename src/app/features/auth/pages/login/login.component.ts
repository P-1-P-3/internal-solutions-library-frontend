import { Component, inject, signal, OnInit } from "@angular/core";
import { form, required, FormField, email, minLength, validate } from "@angular/forms/signals";
import { Router } from "@angular/router";
import { Login, loginModel, PasswordChange, passwordChangeModel } from "../../models/login.interface";
import { StatComponent } from "../../../home/components/stat/stat.component";
import { ErrorMessageComponent } from "../../../../shared/components/error-message/error-message.component";
import { InputValidationDirective } from "../../../../shared/directives/input-validation.directive";
import { AuthService } from "../../../../core/services/auth.service";
import { crossPasswordValidator } from "../../../../shared/utils/custom.validator";
import { DashboardStatsService } from "../../../home/service/dashboard-stats.service";
import { DashboardStats } from "../../../../shared/models/catalog-tables.interface";

@Component({
    templateUrl: 'login.component.html',
    imports: [StatComponent, FormField, ErrorMessageComponent, InputValidationDirective]
})
export default class LoginComponent implements OnInit {
    private readonly _authService = inject(AuthService);
    private readonly _statCount   = inject(DashboardStatsService);
    private readonly _router      = inject(Router);

    readonly passwordChange = signal<boolean>(false);
    readonly messageError   = signal<string>('');
    readonly messageSuccess = signal<string>('');
    readonly statCount      = signal<DashboardStats>({
        solutionsCount: 0,
        categoriesCount: 0,
        technologiesCount: 0,
        solutionsByCategory: []
    });

    readonly model = signal<Login>(loginModel);
    readonly passChangeModel = signal<PasswordChange>(passwordChangeModel);

    readonly loginForm = form(this.model, (path) => {
        required(path.email, { message: 'Este campo es obligatorio' });
        required(path.password, { message: 'Este campo es obligatorio' });

        email(path.email, { message: 'Dirección de correo electrónico invalido' });
    });

    readonly passChangeForm = form(this.passChangeModel, (path) => {
        required(path.password, { message: 'Este campo es obligatorio' });
        minLength(path.password, 8, { message: 'La contraseña debe tener al menos 8 caracteres' });
        required(path.confirm_password, { message: 'Este campo es obligatorio' });
        validate(path.confirm_password, (ctx) =>
            crossPasswordValidator(ctx, ctx.valueOf(path.password))
        );
    });

    ngOnInit() {
        this._statCount.getStatCount().subscribe({
            next: (res) => this.statCount.set(res.data)
        });
    };

    onLogin() {
        this.loginForm().markAsTouched();
        if (this.loginForm().invalid()) return;

        this._authService.login(this.model()).subscribe({
            next: (res) => {
                if (res.data.must_change_password) {
                    this.messageError.set('');
                    this.messageSuccess.set('');
                    this.passwordChange.set(true);
                } else {
                    this._authService.isLoggedIn.set(true);
                    void this._router.navigate(['/']);
                }
            },
            error: (err) => {
                if (err.error.error?.message)
                    this.messageError.set(err.error.error?.message ?? 'No se logro iniciar sesión. Intente nuevamente.')
            }
        });
    };

    onPasswordChange() {
        this.passChangeForm().markAsTouched();
        if(this.passChangeForm().invalid()) return;

        this._authService.passwordChange(this.passChangeModel().password).subscribe({
            next: (res) => {
                if (res.data.message) {
                    this.passwordChange.set(false);
                    this.messageSuccess.set(res.data.message);
                    this.messageError.set('');
                }
            },
            error: (err) => {
                this.messageError.set('No se logro actulizar su contraseña. Intente nuevamente.');
            }
        })
    };
};