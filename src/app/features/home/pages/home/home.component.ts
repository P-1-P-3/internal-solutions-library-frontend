import { Component, inject, signal, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { DashboardStats, Technologies } from "../../../../shared/models/catalog-tables.interface";
import { SolutionService } from "../../../solutions/service/solution.service";
import { StatComponent } from "../../components/stat/stat.component";
import { CategoryStatComponent } from "../../../../shared/components/category-stat/category-stat.component";
import { DashboardStatsService } from "../../service/dashboard-stats.service";
import { SectionTitleComponent } from "../../../../shared/components/section-title/section-title.component";
import { SearchSolutionsComponent } from "../../../../shared/components/search-solutions/search-solutions.component";
import { CatalogSolution } from "../../../solutions/models/catalog-solution.interface";
import { SolutionsCardComponent } from "../../../../shared/components/solutions-card/solutions-card.component";

@Component({
    templateUrl: 'home.component.html',
    imports: [
        StatComponent,
        RouterLink,
        CategoryStatComponent,
        SectionTitleComponent,
        SearchSolutionsComponent,
        SolutionsCardComponent
    ],
})
export default class HomeComponent implements OnInit {
    private readonly _solutionService       = inject(SolutionService);
    private readonly _dashboardStatsService = inject(DashboardStatsService);

    featuredSolutions = signal<CatalogSolution[]>([]);
    technologies      = signal<Technologies[]>([]);
    stat              = signal<DashboardStats>({
        solutionsCount: 0,
        categoriesCount: 0,
        technologiesCount: 0,
        solutionsByCategory: []
    });

    ngOnInit() {
        this.getData();
    };

    private getData() {
        this._solutionService.getSolutions({ limit: 3, offset: 0 }, undefined, { field: 'update_date', order: 'DESC' }).subscribe({
            next: (res) => this.featuredSolutions.set(res?.data)
        });

        this._solutionService.getTechnologies().subscribe({
            next: (res) => this.technologies.set(res?.data)
        });

        this._dashboardStatsService.getDashboardStats().subscribe({
            next: (res) => this.stat.set(res?.data)
        });
    };

    onSearch(value: string) {
        console.log('Search value:', value);
    };
};