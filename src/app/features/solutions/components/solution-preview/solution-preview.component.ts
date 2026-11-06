import { Component, computed, input } from "@angular/core";
import { SolutionModel } from "../../models/contribute.interface";
import { SectionTitleComponent } from "../../../../shared/components/section-title/section-title.component";
import { Categories, Tags, Technologies } from "../../../../shared/models/catalog-tables.interface";

@Component({
    selector: 'app-solution-preview',
    templateUrl: 'solution-preview.component.html',
    imports: [SectionTitleComponent]
})
export class SolutionPreviewComponent {
    solution     = input.required<SolutionModel>();
    categories   = input.required<Categories[]>();
    technologies = input.required<Technologies[]>();
    tags         = input.required<Tags[]>();

    category = computed(() => {
        const categoryId = this.solution().basicInfo.category;
        if (categoryId == null) return 'Categoría';

        return this.categories().find(category => category.id === Number(categoryId))?.type ?? 'Categoría';
    });

    selectedTechnologies = computed(() => {
        const ids = this.solution().classification.technologies;
        return this.technologies().filter(item => ids.includes(item.id));
    });

    selectedTags = computed(() => {
        const ids = this.solution().classification.tags;
        return this.tags().filter(item => ids.includes(item.id));
    });
};