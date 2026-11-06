import { Directive, effect, ElementRef, inject, input, Renderer2 } from "@angular/core";
import { FieldState } from "@angular/forms/signals";

@Directive({
    selector: '[appInputValidation]',
})
export class InputValidationDirective {
    readonly control = input.required<FieldState<any, string>>({ alias: 'appInputValidation' });

    private readonly elementRef = inject(ElementRef<HTMLInputElement>);
    private readonly renderer   = inject(Renderer2);

    constructor() {
        effect(() => {
        const control = this.control();
        const invalid =
            control.touched() &&
            !control.valid() &&
            !control.disabled();

        this.renderer[invalid ? 'addClass' : 'removeClass'](
            this.elementRef.nativeElement,
            'input-error'
        );
        });
    };
};