import { Ref } from 'react';
import { Rosie } from '../../core';
import { cellStyle } from './grid-cell.component';
import { GridColumnProps } from './types';

type GridHeaderProps = {
  ref?: Ref<HTMLDivElement>,
  columns: GridColumnProps[],
  widths: number[],
}

export function GridHeader({ ref, columns, widths }: Readonly<GridHeaderProps>) {
  return <div className="rosie-grid-header" ref={ref}>
    <div className="rosie-grid-row">
      {columns.map((column, colIndex) =>
        <div key={column.field}
             className={Rosie.classNames('rosie-grid-cell', column.alignClass, { 'has-tooltip': !!column.headerTooltip })}
             style={cellStyle(column, widths[colIndex])}
             title={column.headerTooltip}>
          {column.headerRenderer ? column.headerRenderer() : column.header ?? column.field}
        </div>)}
      <div className="rosie-grid-scrollbar-spacer" style={{ width: Rosie.SCROLLBAR_WIDTH }} />
    </div>
  </div>
}
