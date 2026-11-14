import type { FieldContext, PathKind } from "@angular/forms/signals";

export const crossPasswordValidator = (
    ctx: FieldContext<string, PathKind.Child>,
    password: string
) => {
    const confirmPassword = ctx.value();

    if (!confirmPassword) return null;

    return confirmPassword === password
        ? null
        : { kind: 'passwordMismatch', message: 'Las contraseñas no coinciden' };
};