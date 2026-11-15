import { Component, input } from "@angular/core";
import { FieldTree, FormField } from "@angular/forms/signals";
import { UserModel } from "../../models/users.interface";
import { SectionTitleComponent } from "../../../../../shared/components/section-title/section-title.component";
import { InputValidationDirective } from "../../../../../shared/directives/input-validation.directive";
import { ErrorMessageComponent } from "../../../../../shared/components/error-message/error-message.component";
import { Roles } from "../../../../../shared/models/catalog-tables.interface";

@Component({
    selector: 'app-access-security-section',
    templateUrl: 'access-security-section.component.html',
    imports: [SectionTitleComponent, FormField, InputValidationDirective, ErrorMessageComponent]
})
export class AccessSecuritySectionComponent {
    fields = input.required<FieldTree<UserModel['accessAndSecurity']>>();
    roles  = input.required<Roles[]>();
};