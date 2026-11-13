import { Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { form, maxLength, required } from "@angular/forms/signals"
import { ActivatedRoute, Router, RouterLink } from "@angular/router";

import { SolutionService } from "../../service/solution.service";
import { CreateSolution, SolutionModel, solutionModel, UpdateSolution } from "../../models/contribute.interface";
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
    private readonly _activatedRoute  = inject(ActivatedRoute);
    private readonly _router          = inject(Router);

    private readonly solutionID = signal<string | null>(null);
    private temporaryTags: Tags[]         = [];
    private temporaryTech: Technologies[] = [];

    readonly solutionId = computed(() => this.solutionID());
    readonly action     = computed(() => this.solutionID() ? 'edit' : 'create');

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
        required(path.publication.repository_url, { message: message.required });
        required(path.publication.version, { message: message.required });

        maxLength(path.basicInfo.title, 100, { message: 'Máximo 100 caracteres' });
        maxLength(path.publication.repository_url, 255, { message: 'Máximo 255 caracteres' });
    });

    ngOnInit() {
        this.loadSolutionFromRoute();
        this.loadClassificationData();
    };

    onCancel() {
        void this._router.navigate(['catalog']);
    };

    executeAction(action: 'create' | 'edit') {
        this.solutionForm().markAsTouched();
        if (this.solutionForm().invalid()) return;

        if(action === 'create') {
            this.postSolution();
        } else if (action  === 'edit') {
            this.updateSolution();
        }
    };

    private postSolution() {
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

    private updateSolution() {
        const solutionId = this.solutionID();
        if (!solutionId) return;

        const currentTags = this.model().classification.tags;
        const currentTechnologies = this.model().classification.technologies;

        const solutionToUpdate = {
            id: solutionId,
            ...this.model().basicInfo,
            ...this.model().documentation,
            ...this.model().publication,
            tags:         this.getSelectionChanges(currentTags, this.temporaryTags),
            technologies: this.getSelectionChanges(currentTechnologies, this.temporaryTech),
        } as unknown as UpdateSolution;
        
        this._solutionService.updateSolution(solutionToUpdate).subscribe({
            next: (res) => {
                if (res.status === 'success') {
                    this.solutionForm().reset();
                    this.solutionCreated.set(true);
                    this.creationError.set(false);
                    return;
                }

                this.creationError.set(true);
            },
            error: () => this.creationError.set(true)
        });
    };

    private getSelectionChanges(currentIds: number[], originalItems: { id: number }[]) {
        const originalIds = originalItems.map(item => item.id);

        return {
            new:    currentIds.filter(id => !originalIds.includes(id)),
            remove: originalIds.filter(id => !currentIds.includes(id)),
        };
    };

    private loadSolutionFromRoute() {
        this.solutionID.set(this._activatedRoute.snapshot.paramMap.get('solution_id'));
        
        if(!this.solutionID()) return;

        this._solutionService.getSolution(this.solutionID()!).subscribe({
            next: (res) => {
                const data = res.data;
                if(res.status === 'success') {
                    this.temporaryTags = data.tags;
                    this.temporaryTech = data.technologies;

                    this.model.set({
                        basicInfo: {
                            title:           data.title,
                            description:     data.description,
                            category:        data.category.id,
                            functional_area: data.functional_area.id,
                        },
                        classification: {
                            tags:         [...data.tags.map(item => item.id)],
                            technologies: [...data.technologies.map(item => item.id)]
                        },
                        documentation: {
                            best_practices:         data.best_practices,
                            implementation_example: data.implementation_example,
                            requirements:           data.requirements,
                            common_errors:          data.common_errors,
                        },
                        publication: {
                            repository_url: data.repository_url,
                            version:        data.version
                        }
                    })
                }
            },
            error: (err) => this._router.navigate(['catalog'])
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