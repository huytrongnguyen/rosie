import { CSSProperties } from 'react';
import { DataModel, Rosie, formatCellText, isEmptyValue } from '../../core';
import { GridColumnProps } from './types';

type GridCellProps = {
  column: GridColumnProps,
  width: number,
  record: DataModel<any>,
  rowIndex: number,
  colIndex: number,
}

export function cellStyle({ flex }: GridColumnProps, width: number): CSSProperties {
  return flex ? { flex: '1 1 auto', minWidth: width } : { flex: `0 0 ${width}px` };
}

export function GridCell({ column, width, record, rowIndex, colIndex }: Readonly<GridCellProps>) {
  const { field, format, alignClass, renderer, className } = column,
        value = record.get(field);

  return <div className={Rosie.classNames('rosie-grid-cell', alignClass, className, { 'is-empty': isEmptyValue(value) })}
              style={cellStyle(column, width)}>
    {renderer ? renderer(value, record, rowIndex, colIndex) : formatCellText(value, format)}
  </div>
}
