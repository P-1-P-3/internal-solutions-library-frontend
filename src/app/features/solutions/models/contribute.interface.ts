import { Solution, Tags, Technologies } from "../../../shared/models/catalog-tables.interface";

export interface CreateSolution extends Solution {
    tags: Tags[];
    technologies: Technologies[];
};

export interface SolutionModel {
    basicInfo: {
        title: string;
        description: string;
        category: number | null;
        functional_area: number | null;
    };
    classification: {
        technologies: number[];
        tags: number[];
    };
    documentation: {
        requirements: string;
        implementation_example: string;
        best_practices: string;
        common_errors: string;
    };
    publication: {
        repository_url: string;
        version: string;
    };
};

export const solutionModel: SolutionModel = {
    basicInfo: {
        title: '',
        description: '',
        category: null,
        functional_area: null
    },
    classification: {
        technologies: [],
        tags: []
    },
    documentation: {
        requirements: '',
        implementation_example: '',
        best_practices: '',
        common_errors: ''
    },
    publication: {
        repository_url: '',
        version: ''
    }
};