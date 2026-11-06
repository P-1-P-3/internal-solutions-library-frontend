import { Component, input, signal } from "@angular/core";
import { FieldState } from "@angular/forms/signals";

@Component({
    selector: 'app-error-message',
    template: `
        @if (shouldShowError()) {
            @for (error of controls().errors(); track error) {
                <p class="text-[0.75rem] text-error mt-1">{{ error.message }}</p>
            }
        }
    `
})
export class ErrorMessageComponent {
    controls   = input.required<FieldState<any, string | number>>();
    show = signal(false);

    shouldShowError(): boolean {
        return this.controls().touched() && this.controls().invalid(); //(this.controls()!.touched);
    };
};