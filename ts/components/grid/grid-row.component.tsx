import { DataModel, Rosie } from '../../core';
import { GridCell } from './grid-cell.component';
import { GridColumnProps } from './types';

type GridRowProps = {
  columns: GridColumnProps[],
  widths: number[],
  record: DataModel<any>,
  rowIndex: number,
}

export function GridRow({ columns, widths, record, rowIndex }: Readonly<GridRowProps>) {
  return <div className={Rosie.classNames('rosie-grid-row', { selected: record.selected })}>
    {columns.map((column, colIndex) =>
      <GridCell key={column.field} column={column} width={widths[colIndex]}
                record={record} rowIndex={rowIndex} colIndex={colIndex} />)}
  </div>
}
