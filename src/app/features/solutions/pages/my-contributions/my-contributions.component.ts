import { Component, computed, effect, inject, OnInit, signal } from "@angular/core";
import { AuthService } from "../../../../core/services/auth.service";
import { CatalogSolution } from "../../models/catalog-solution.interface";
import { SolutionResultGridComponent } from "../../components/solution-result-grid/solution-result-grid.component";
import { SolutionService } from "../../service/solution.service";
import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";
import { ConfirmationModalComponent } from "../../../../shared/components/confirm-modal/confirm-modal.component";

@Component({
    templateUrl: 'my-contributions.component.html',
    imports: [SolutionResultGridComponent, PaginationComponent, ConfirmationModalComponent]
})
export default class MyContributionsComponent implements OnInit {
    private readonly _authService = inject(AuthService);
    private readonly _solutionService = inject(SolutionService);
    
    readonly solutions = signal<CatalogSolution[]>([]);
    readonly isLoading = signal(true);
    readonly loadError = signal('');
    readonly isAdmin   = computed(() => this._authService.currentUser().role.id == 1);

    readonly currentPage  = signal<number>(1);
    readonly pageSize     = signal<number>(10);
    readonly totalItems   = signal<number>(0);

    readonly pendingDeleteId = signal<string | null>(null);
    readonly isDeleting      = signal(false);
    readonly deleteError     = signal('');

    private readonly paginationInitialized = signal(false);

    private readonly contributionsEffect = effect((onCleanup) => {
        if (!this.paginationInitialized()) return;

        this.isLoading.set(true);
        this.loadError.set('');

        const request = this._solutionService.getSolutionsByUser({
            page: this.currentPage(),
            pageSize: this.pageSize()
        }).subscribe({
            next: (res) => {
                this.solutions.set(res.data.items);
                this.totalItems.set(res.data.pagination.totalItems);
                this.isLoading.set(false);
            },
            error: () => {
                this.isLoading.set(false);
                this.totalItems.set(0);
                this.solutions.set([]);
                this.loadError.set('No se pudieron cargar tus contribuciones. Inténtalo nuevamente.');
            }
        });

        onCleanup(() => request.unsubscribe());
    });

    ngOnInit(): void {
        const userId = this._authService.currentUser().id;
        if (!userId) {
            this.isLoading.set(false);
            this.loadError.set('No se pudo identificar al usuario de la sesión.');
            return;
        }

        this.paginationInitialized.set(true);
    };

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
                this.solutions.update((items) => items.filter((item) => item.id !== id));
                this.totalItems.update((total) => Math.max(0, total - 1));
                this.isDeleting.set(false);
                this.pendingDeleteId.set(null);
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
