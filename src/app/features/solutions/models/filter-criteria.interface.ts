export interface SolutionFilters {
    title:        string;
    categories:   number[];
    funcAreas:    number[];
    technologies: number[];
    tags:         number[]
};

export interface SolutionSort {
    field: string;
    order: 'ASC' | 'DESC';
};