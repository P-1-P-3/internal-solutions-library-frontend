export type SelectionMode =
    | 'none'
    | 'single'
    | 'multiple';

export interface TableColumnBase {
    id: string;
    title: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

export type TableValue = string | number | boolean | null | undefined;

export interface TableValueColumn<T> extends TableColumnBase {
    type?: 'text' | 'number' | 'boolean' | 'badge' | 'icon' | 'avatar';
    value: (row: T) => TableValue;
    format?: (value: TableValue, row: T) => string;
    class?: string | ((value: TableValue, row: T) => string);
}

export interface TableDateColumn<T> extends TableColumnBase {
    type: 'date';
    value: (row: T) => Date | string | number | null | undefined;
    dateFormat?: string;
}

export interface TableStackedColumn<T> extends TableColumnBase {
    type: 'stacked';
    avatar?: (row: T) => TableValue;
    primary: (row: T) => TableValue;
    secondary: (row: T) => TableValue;
    primaryFormat?: (value: TableValue, row: T) => string;
    secondaryFormat?: (value: TableValue, row: T) => string;
}

export interface TableActionColumn<T> extends TableColumnBase {
    type: 'action';
    actions: readonly TableAction[];
}

export type TableColumn<T> =
    | TableValueColumn<T>
    | TableDateColumn<T>
    | TableStackedColumn<T>
    | TableActionColumn<T>;

export interface RowAction<T> {
    action: string;
    row: T;
}

export interface TableAction {
    id: string;
    title: string;
    class?: string;
    label?: string;
    icon?: string;
    disabled?: boolean;
}