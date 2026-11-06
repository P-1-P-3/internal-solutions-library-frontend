import { Component, input } from "@angular/core";
import { FieldTree } from "@angular/forms/signals";
import { SolutionModel } from "../../models/contribute.interface";
import { SectionTitleComponent } from "../../../../shared/components/section-title/section-title.component";
import { ComboboxComponent } from "../../../../shared/components/combobox/combobox.component";
import { Tags, Technologies } from "../../../../shared/models/catalog-tables.interface";
import { InputValidationDirective } from "../../../../shared/directives/input-validation.directive";
import { ErrorMessageComponent } from "../../../../shared/components/error-message/error-message.component";

@Component({
    selector: 'app-classification-section',
    templateUrl: 'classification-section.component.html',
    imports: [SectionTitleComponent, ComboboxComponent, InputValidationDirective, ErrorMessageComponent]
})
export class ClassificationSectionComponent {
    fields       = input.required<FieldTree<SolutionModel['classification']>>();
    tags         = input.required<Tags[]>();
    technologies = input.required<Technologies[]>();

    tagLabel = (tag: Tags) => tag.tag;
    technologyLabel = (technology: Technologies) => technology.technology;

    onSelectedTagIdsChange(value: number[]) {
        this.fields().tags().value.set(value);
    };

    onSelectedTechIdsChange(value: number[]) {
        this.fields().technologies().value.set(value);
    };
};