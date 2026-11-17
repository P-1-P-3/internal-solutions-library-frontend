export interface Response<T> {
    status: 'success' | 'error',
    data: T
};

export interface Pagination {
    page:  number;
    pageSize: number;
};

export interface PaginationRes {
    hasNext: boolean;
    hasPrevious: boolean;
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}