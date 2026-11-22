import { Component, input, output } from "@angular/core";

@Component({
    selector: 'app-confirm-modal',
    templateUrl: 'confirm-modal.component.html'
})
export class ConfirmationModalComponent {
    title = input('Confirmar acción');
    message = input('¿Estás seguro de que deseas continuar?');
    cancelLabel = input('Cancelar');
    confirmLabel = input('Confirmar');
    confirmingLabel = input('Procesando...');
    confirmVariant = input<'primary' | 'neutral' | 'error' | 'warning' | 'success'>('primary');
    isConfirming = input(false);
    errorMessage = input('');

    confirmed = output<void>();
    cancelled = output<void>();

    confirm(): void {
        if (!this.isConfirming()) {
            this.confirmed.emit();
        }
    };

    close(): void {
        if (!this.isConfirming()) {
            this.cancelled.emit();
        }
    };
};