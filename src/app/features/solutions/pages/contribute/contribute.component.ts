import { Component, ElementRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { form, maxLength, required } from "@angular/forms/signals"
import { Router, RouterLink } from "@angular/router";

import { SolutionService } from "../../service/solution.service";
import { CreateSolution, SolutionModel, solutionModel } from "../../models/contribute.interface";
import { BasicInfoSectionComponent } from "../../components/basic-info-section/basic-info-section.component";
import { ClassificationSectionComponent } from "../../components/classification-section/classification-section.component";
import { DocumentationSectionComponent } from "../../components/documentation-section/documentation-section.component";
import { PublicationSectionComponent } from "../../components/publication-section/publication-section.component";
import { SolutionPreviewComponent } from "../../components/solution-preview/solution-preview.component";
import { Categories, FunctionalAreas, Tags, Technologies } from "../../../../shared/models/catalog-tables.interface";

@Component({
    templateUrl: 'contribute.component.html',
    imports: [
        BasicInfoSectionComponent,
        ClassificationSectionComponent,
        DocumentationSectionComponent,
        PublicationSectionComponent,
        SolutionPreviewComponent,
        RouterLink
    ]
})
export default class ContributeComponent implements OnInit {
    private readonly _solutionService = inject(SolutionService);
    private readonly _router          = inject(Router);

    readonly categories      = signal<Categories[]>([]);
    readonly functionalAreas = signal<FunctionalAreas[]>([]);
    readonly technologies    = signal<Technologies[]>([]);
    readonly tags            = signal<Tags[]>([]);
    readonly solutionCreated = signal(false);
    readonly creationError   = signal(false);

    readonly model = signal<SolutionModel>(solutionModel);

    readonly solutionForm = form(this.model, (path) => {
        const message = {
            required: 'Este campo es obligatorio',
        };

        required(path.basicInfo.title, { message: message.required });
        required(path.basicInfo.description, { message: message.required });
        required(path.basicInfo.category, { message: message.required });
        required(path.basicInfo.functional_area, { message: message.required });
        required(path.classification.technologies, { message: message.required });
        required(path.classification.tags, { message: message.required });
        required(path.documentation.requirements, { message: message.required });
        required(path.documentation.implementation_example, { message: message.required });
        required(path.documentation.best_practices, { message: message.required });
        required(path.documentation.common_errors, { message: message.required });
        required(path.publication.repository_url, { message: message.required });
        required(path.publication.version, { message: message.required });

        maxLength(path.basicInfo.title, 100, { message: 'Máximo 100 caracteres' });
        maxLength(path.publication.repository_url, 255, { message: 'Máximo 255 caracteres' });
    });

    ngOnInit() {
        this.loadClassificationData();
    };

    onCancel() {
        void this._router.navigate(['catalog']);
    };

    onPostSolution() {
        this.solutionForm().markAsTouched();
        if (this.solutionForm().invalid()) return;

        const solutionToCreate = {
            ...this.model().basicInfo,
            ...this.model().classification,
            ...this.model().documentation,
            ...this.model().publication,
        } as unknown as CreateSolution;

        this._solutionService.createSolution(solutionToCreate).subscribe({
            next: (res) => {
                if (res.status === 'success') {
                    this.solutionForm().reset();
                    this.model.set(solutionModel);
                    this.solutionCreated.set(true);
                    this.creationError.set(false);
                    return;
                }

                this.creationError.set(true);
            },
            error: () => this.creationError.set(true)
        });
    };

    private loadClassificationData() {
        this._solutionService.getCategories().subscribe({
            next: (res) => this.categories.set(res?.data)
        });

        this._solutionService.getFunctionalAreas().subscribe({
            next: (res) => this.functionalAreas.set(res?.data)
        });

        this._solutionService.getTechnologies().subscribe({
            next: (res) => this.technologies.set(res?.data)
        });

        this._solutionService.getTags().subscribe({
            next: (res) => this.tags.set(res?.data)
        });
    };

    @ViewChild('successMessage')
    set successMessage(element: ElementRef<HTMLElement> | undefined) {
        element?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};