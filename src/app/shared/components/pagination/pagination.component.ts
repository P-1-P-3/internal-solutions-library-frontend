import { Component, computed, effect, input, output } from "@angular/core";

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html'
})
export class PaginationComponent {
    labelSize            = input<string>('Filas por página');
    totalRecords         = input<number>(0);
    pageSize             = input<number>(10);
    currentPage          = input<number>(1);
    pageSizeOption       = input<number[]>([10, 25, 50]);
    showPageSizeSelector = input<boolean>(true);

    currentPageChange = output<number>();
    pageSizeChange    = output<number>();

    totalPages = computed(() =>
        Math.ceil(this.totalRecords() / this.pageSize())
    );

    validateCurrentPage = effect(() => {
        const totalPages = this.totalPages();
        const currentPage = this.currentPage();

        if (totalPages === 0) {
            if (currentPage !== 1) this.currentPageChange.emit(1);
            return;
        }

        if (currentPage > totalPages) this.currentPageChange.emit(totalPages);
        else if (currentPage < 1) this.currentPageChange.emit(1);
    });

    setPageSize(value: string) {
        this.pageSizeChange.emit(Number.parseInt(value));

        const newTotalPages = Math.ceil(this.totalRecords() / Number.parseInt(value));

        if (this.currentPage() > newTotalPages)
            this.currentPageChange.emit(newTotalPages || 1);
    };

    onPreviousPage() {
        if (this.currentPage() > 1)
            this.currentPageChange.emit(this.currentPage() - 1);
    };

    onNextPage() {
        if (this.currentPage() < this.totalPages())
            this.currentPageChange.emit(this.currentPage() + 1);
    };

    goFirstPage() {
        if (this.currentPage() !== 1)
            this.currentPageChange.emit(1);
    };

    goLastPage() {
        const totalPages = this.totalPages();
        if (totalPages > 0 && this.currentPage() !== totalPages)
            this.currentPageChange.emit(totalPages);
    };
};