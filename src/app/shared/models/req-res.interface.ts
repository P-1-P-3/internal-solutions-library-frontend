export interface Response<T> {
    status: 'success' | 'error',
    data: T
};

export interface Pagination {
    limit:  number;
    offset: number;
};
