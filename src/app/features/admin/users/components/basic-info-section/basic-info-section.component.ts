import { Component, input } from "@angular/core";
import { FieldTree, FormField } from "@angular/forms/signals";
import { UserModel } from "../../models/users.interface";
import { InputValidationDirective } from "../../../../../shared/directives/input-validation.directive";
import { ErrorMessageComponent } from "../../../../../shared/components/error-message/error-message.component";
import { SectionTitleComponent } from "../../../../../shared/components/section-title/section-title.component";

@Component({
    selector: 'app-basic-user-info-section',
    templateUrl: 'basic-info-section.component.html',
    imports: [FormField, InputValidationDirective, ErrorMessageComponent, SectionTitleComponent]
})
export class BasicInfoSectionComponent {
    fields = input.required<FieldTree<UserModel['basicInfo']>>();
};