import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SolutionService } from "../../service/solution.service";
import { CatalogSolution } from "../../models/catalog-solution.interface";
import { SolutionDetailComponent } from "../../components/solution-detail/solution-detail.component";

@Component({
    selector: 'app-detail',
    templateUrl: 'detail.component.html',
    imports: [SolutionDetailComponent]
})
export default class DetailComponent implements OnInit {
    private readonly _activatedRoute  = inject(ActivatedRoute);
    private readonly _solutionService = inject(SolutionService);

    private readonly solutionId = signal('');

    public solution = signal<CatalogSolution | null>(null);

    ngOnInit() {
        this.solutionId.set(this._activatedRoute.snapshot.paramMap.get('solution_id') || '');
        this.getSolution();
    };

    private getSolution() {
        this._solutionService.getSolution(this.solutionId()).subscribe({
            next:  (res) => this.solution.set(res.data),
            error: (err) => this.solution.set(null)
        });
    };
};