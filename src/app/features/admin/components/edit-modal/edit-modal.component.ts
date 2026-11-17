import { Component, effect, input, output, signal } from "@angular/core";

@Component({
    selector: 'app-edit-modal',
    templateUrl: 'edit-modal.component.html'
})
export class EditModalComponent {
    title        = input.required<string>();
    label        = input.required<string>();
    initialValue = input.required<string>();
    placeholder  = input('');
    saveLabel    = input('Guardar');
    isSaving     = input(false);
    errorMessage = input('');

    save          = output<string>();
    editCancelled = output<void>();

    readonly value           = signal('');
    readonly validationError = signal('');

    private readonly initialValueEffect = effect(() => {
        this.value.set(this.initialValue());
        this.validationError.set('');
    });

    submit(event: Event): void {
        event.preventDefault();

        const value = this.value().trim();
        if (!value) {
            this.validationError.set(`${this.label()} es obligatorio.`);
            return;
        }

        this.save.emit(value);
    };

    close(): void {
        if (!this.isSaving()) {
            this.editCancelled.emit();
        }
    };
};