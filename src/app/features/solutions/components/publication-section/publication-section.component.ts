import { Component, input } from "@angular/core";
import { FieldTree, FormField } from "@angular/forms/signals";
import { SolutionModel } from "../../models/contribute.interface";
import { SectionTitleComponent } from "../../../../shared/components/section-title/section-title.component";
import { InputValidationDirective } from "../../../../shared/directives/input-validation.directive";
import { ErrorMessageComponent } from "../../../../shared/components/error-message/error-message.component";

@Component({
    selector: 'app-publication-section',
    templateUrl: 'publication-section.component.html',
    imports: [SectionTitleComponent, FormField, InputValidationDirective, ErrorMessageComponent]
})
export class PublicationSectionComponent {
    fields = input.required<FieldTree<SolutionModel['publication']>>();
};