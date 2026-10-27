import { CSSProperties, MouseEvent } from 'react';
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
  // A flex column grows from its measured width; an `auto` basis would size it by each row's own content, so the
  // cells of one column would no longer line up from row to row.
  return flex ? { flex: `1 0 ${width}px`, minWidth: width } : { flex: `0 0 ${width}px` };
}

/** Shows a cell's whole text as its tooltip only while the cell is too narrow and ends in an ellipsis. */
export function titleWhenTruncated(event: MouseEvent<HTMLDivElement>) {
  const cell = event.currentTarget;
  cell.title = cell.scrollWidth > cell.clientWidth ? cell.textContent ?? '' : '';
}

export function GridCell({ column, width, record, rowIndex, colIndex }: Readonly<GridCellProps>) {
  const { field, format, alignClass, renderer, className } = column,
        value = record.get(field);

  return <div className={Rosie.classNames('rosie-grid-cell', alignClass, className, { 'is-empty': isEmptyValue(value) })}
              style={cellStyle(column, width)} onMouseEnter={titleWhenTruncated}>
    {renderer ? renderer(value, record, rowIndex, colIndex) : formatCellText(value, format)}
  </div>
}
