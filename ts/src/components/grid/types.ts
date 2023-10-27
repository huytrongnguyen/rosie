import { PropsWithChildren, HTMLAttributes, ReactElement } from 'react';

export interface GridProps extends PropsWithChildren<any> {
  // data?: any[],
  // className?: string,
  // fitScreen?: boolean,
  // fitWidth?: boolean,
  // fitHeight?: boolean,
  // footer?: boolean,
  // footerRenderer?: (records: any[]) => ReactElement,
  // checkboxSelection?: boolean,
  // onCheckChange?: (record: any) => void,
  // transpose?: boolean,
}

export interface GridColumnProps extends HTMLAttributes<HTMLDivElement> {
  field: string,
  headerName?: string,
  // locked?: boolean,
  // numeric?: boolean,
  // numericFormat?: string,
  // editable?: boolean,
  // cellRenderer?: (value: any, item: any, rowIndex: number, colIndex: number, record: any) => string | number | ReactElement,
}