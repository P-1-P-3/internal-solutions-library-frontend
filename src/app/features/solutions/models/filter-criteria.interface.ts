export interface SolutionFilters {
    title:           string;
    categories:      number[];
    functionalAreas: number[];
    technologies:    number[];
    tags:            number[];
};

export interface SolutionSort {
    field: string;
    order: 'ASC' | 'DESC';
};