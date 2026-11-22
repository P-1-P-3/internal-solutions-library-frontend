import { Component, computed, inject, input, signal } from "@angular/core";
import { CatalogSolution } from "../../models/catalog-solution.interface";
import { DatePipe } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../../core/services/auth.service";
import { SolutionService } from "../../service/solution.service";
import { ConfirmationModalComponent } from "../../../../shared/components/confirm-modal/confirm-modal.component";

@Component({
    selector: 'app-solution-detail',
    templateUrl: 'solution-detail.component.html',
    imports: [DatePipe, RouterLink, ConfirmationModalComponent]
})
export class SolutionDetailComponent {
    private readonly _authService     = inject(AuthService);
    private readonly _solutionService = inject(SolutionService);
    private readonly _router          = inject(Router);
    
    public solution = input.required<CatalogSolution>();
    
    readonly currentUser = computed(() => this._authService.currentUser());

    readonly pendingDeleteId = signal<string | null>(null);
    readonly isDeleting      = signal(false);
    readonly deleteError     = signal('');

    requestDelete(id: string): void {
        this.pendingDeleteId.set(id);
        this.deleteError.set('');
    };

    confirmDelete(): void {
        const id = this.pendingDeleteId();
        if (!id || this.isDeleting()) return;

        this.isDeleting.set(true);
        this.deleteError.set('');

        this._solutionService.deleteSolution(id).subscribe({
            next: () => {
                this.isDeleting.set(false);
                this.pendingDeleteId.set(null);
                void this._router.navigate(['/catalog'], { replaceUrl: true });
            },
            error: (err) => {
                this.isDeleting.set(false);
                this.deleteError.set(err.error?.error?.message ?? 'No se logró eliminar la solución. Inténtalo nuevamente.');
            }
        });
    };

    cancelDelete(): void {
        if (this.isDeleting()) return;

        this.pendingDeleteId.set(null);
        this.deleteError.set('');
    };
};