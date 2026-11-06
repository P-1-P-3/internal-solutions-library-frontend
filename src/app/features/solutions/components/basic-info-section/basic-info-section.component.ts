import { Component, input } from "@angular/core";
import { FieldTree, FormField } from "@angular/forms/signals";
import { SolutionModel } from "../../models/contribute.interface";
import { SectionTitleComponent } from "../../../../shared/components/section-title/section-title.component";
import { Categories, FunctionalAreas } from "../../../../shared/models/catalog-tables.interface";
import { InputValidationDirective } from "../../../../shared/directives/input-validation.directive";
import { ErrorMessageComponent } from "../../../../shared/components/error-message/error-message.component";

@Component({
    selector: 'app-basic-info-section',
    templateUrl: 'basic-info-section.component.html',
    imports: [SectionTitleComponent, FormField, InputValidationDirective, ErrorMessageComponent]
})
export class BasicInfoSectionComponent {
    fields          = input.required<FieldTree<SolutionModel['basicInfo']>>();
    categories      = input.required<Categories[]>();
    functionalAreas = input.required<FunctionalAreas[]>();
};