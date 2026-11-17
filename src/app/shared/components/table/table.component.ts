import { Component, input, output, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import {
    SelectionMode,
    RowAction,
    TableColumn,
    TableDateColumn,
    TableStackedColumn,
    TableValue,
    TableValueColumn
} from "./table.interface";
import { PaginationComponent } from "../pagination/pagination.component";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    imports: [PaginationComponent, DatePipe]
})
export class TableComponent<T> {
    data          = input.required<T[]>();
    columns       = input.required<TableColumn<T>[]>();
    selectionMode = input<SelectionMode>('none');
    rowVerticalPadding = input('1rem');
    
    executeAction    = output<RowAction<T>>();
    selectionChanged = output<T[]>();

    public currentPage = signal<number>(1);
    public pageSize    = signal<number>(10);

    protected selectedRows = signal<T[]>([]);

    getPaginatedData(): T[] {
        const startIndex = (this.currentPage() - 1) * this.pageSize();
        const endIndex   = startIndex + this.pageSize();
        return this.data().slice(startIndex, endIndex);
    };

    getCellText(column: TableValueColumn<T>, row: T): string {
        const value = column.value(row);
        return this.formatValue(value, row, column.format);
    };

    getStackedPrimaryText(column: TableStackedColumn<T>, row: T): string {
        return this.formatValue(column.primary(row), row, column.primaryFormat);
    };

    getStackedAvatarText(column: TableStackedColumn<T>, row: T): string {
        return this.formatValue(column.avatar?.(row), row);
    };

    getStackedSecondaryText(column: TableStackedColumn<T>, row: T): string {
        return this.formatValue(column.secondary(row), row, column.secondaryFormat);
    };

    getCellClass(column: TableValueColumn<T>, row: T): string {
        const value = column.value(row);
        return typeof column.class === 'function'
            ? column.class(value, row)
            : column.class ?? '';
    };

    getDateValue(column: TableDateColumn<T>, row: T): Date | string | number | null | undefined {
        return column.value(row);
    };

    private formatValue(
        value: TableValue,
        row: T,
        format?: (value: TableValue, row: T) => string
    ): string {
        return format?.(value, row) ?? (value == null ? '' : String(value));
    };

    toggleSelection (row: T) {
        if (this.selectionMode() === 'single') {
            this.selectedRows.set([row]);
            this.selectionChanged.emit([row]);
            return;
        }

        const current = this.selectedRows();
        const exists  = current.includes(row);

        const updated = exists ? current.filter(item => item !== row) : [...current, row];

        this.selectedRows.set(updated);
        this.selectionChanged.emit(updated);
    };

    isSelected(row: T): boolean {
        return this.selectedRows().includes(row);
    };
};