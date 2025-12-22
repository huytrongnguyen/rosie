import { PropsWithChildren, HTMLAttributes, ReactElement } from 'react';
import { DataModel, DataStore } from '../../core';

export interface GridProps extends PropsWithChildren<any> {
  // data?: any[],
  store?: DataStore<any>,
  // checkboxSelection?: boolean,
  // bbar?: (records: DataModel<any>[]) => ReactElement,
  // pagingToolbar?: { pageSize?: number },
  fitScreen?: boolean,
  fitWidth?: boolean,
  fitHeight?: boolean,
  pagingToolbar?: boolean,
}

export type GridRowProps = {
  record: DataModel<any>,
  rowIndex: number,
  columns: GridColumnProps[],
  checkboxSelection?: boolean,
}

export interface GridColumnProps extends HTMLAttributes<HTMLDivElement> {
  field: string,
  headerName?: string,
  renderer?: (value: any, record?: DataModel<any>, rowIndex?: number, colIndex?: number) => string | number | ReactElement,
}