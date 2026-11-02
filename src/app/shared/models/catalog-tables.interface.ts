export interface Categories {
    id:   number;
    type: string;
};

export interface FunctionalAreas {
    id:              number;
    functional_area: string;
};

export interface Technologies {
    id:         number;
    technology: string;
};

export interface Tags {
    id:  number;
    tag: string;
};

export interface Solution {
    id:                     string;
    title:                  string;
    description:            string;
    requirements:           string;
    implementation_example: string;
    best_practices:         string;
    common_errors:          string;
    category:               Categories;
    functional_area:        FunctionalAreas;
    repository_url:         string;
    version:                string;
    update_date:            string;
    created_by:             string;
    updated_by:             string;
}

export interface DashboardStats {
    solutionsCount: number;
    categoriesCount: number;
    technologiesCount: number;
    solutionsByCategory: SolutionsByCategory[];
};

export interface SolutionsByCategory extends Categories {
    solutionsCount: number;
};