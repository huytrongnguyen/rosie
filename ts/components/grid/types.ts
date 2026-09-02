import { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { ColumnFormat, DataModel, DataStore } from '../../core';

export type SortDirection = 'asc' | 'desc';

export type SortState = { field: string, dir: SortDirection };

export type ColumnLock = boolean | 'left' | 'right';

export interface GridColumnProps extends HTMLAttributes<HTMLDivElement> {
  field: string;
  header?: string;
  headerRenderer?: () => ReactNode;
  headerTooltip?: string;
  width?: number;
  flex?: boolean;
  alignClass?: string;
  format?: ColumnFormat;
  locked?: ColumnLock;
  renderer?: (value: any, record: DataModel<any>, rowIndex: number, colIndex: number) => ReactNode;
  sortable?: boolean;
  sortComparator?: (a: unknown, b: unknown) => number;
  resizable?: boolean;
}

export type GridEmptyProps = {
  title?: string;
  desc?: string;
};

export interface GridProps {
  store: DataStore<any>;
  children: ReactElement<GridColumnProps> | ReactElement<GridColumnProps>[];
  className?: string;
  sortable?: boolean;
  resizable?: boolean;
  selectable?: boolean;
  defaultSort?: SortState;
  onSortChange?: (sort: SortState | null) => void;
  onSelectionChange?: (records: DataModel<any>[]) => void;
  searchText?: string;
  paginated?: boolean;
  pageSize?: number;
  treeDepths?: number[];
  treeIndentPx?: number;
  loading?: boolean;
  skeletonRows?: number;
  empty?: GridEmptyProps;
}
