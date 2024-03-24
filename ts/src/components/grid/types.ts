import { PropsWithChildren, HTMLAttributes, ReactElement } from 'react';
import { DataModel, DataStore } from '../../core';

export interface GridProps extends PropsWithChildren<any> {
  data?: any[],
  store?: DataStore<any>,
  checkboxSelection?: boolean,
  onSelectionChange?: (record: DataModel<any>) => void,
  bbar?: (records: DataModel<any>[]) => ReactElement,
  pagingToolbar?: { pageSize?: number },
}

export interface GridColumnProps extends HTMLAttributes<HTMLDivElement> {
  field: string,
  headerName?: string,
  renderer?: (value: any, record?: DataModel<any>, rowIndex?: number, colIndex?: number) => string | number | ReactElement,
}