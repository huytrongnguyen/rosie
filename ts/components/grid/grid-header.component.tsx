import { PointerEvent, Ref } from 'react';
import { Rosie } from '../../core';
import { cellStyle, titleWhenTruncated } from './grid-cell.component';
import { GridColumnProps } from './types';

type GridHeaderProps = {
  ref?: Ref<HTMLDivElement>,
  columns: GridColumnProps[],
  widths: number[],
  resizable?: boolean,
  onResize?: (field: string, width: number) => void,
}

const MIN_COLUMN_WIDTH_PX = 40;

export function GridHeader({ ref, columns, widths, resizable, onResize }: Readonly<GridHeaderProps>) {
  const startResize = (event: PointerEvent<HTMLDivElement>, field: string, width: number) => {
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget, startX = event.clientX;
    handle.setPointerCapture(event.pointerId);
    const move = (moved: globalThis.PointerEvent) => onResize?.(field, Math.max(MIN_COLUMN_WIDTH_PX, Math.round(width + moved.clientX - startX)));
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  };

  return <div className="rosie-grid-header" ref={ref}>
    <div className="rosie-grid-row">
      {columns.map((column, colIndex) =>
        <div key={column.field}
             className={Rosie.classNames('rosie-grid-cell', column.alignClass, { 'has-tooltip': !!column.headerTooltip })}
             style={cellStyle(column, widths[colIndex])}
             title={column.headerTooltip}
             onMouseEnter={column.headerTooltip ? undefined : titleWhenTruncated}>
          {column.headerRenderer ? column.headerRenderer() : column.header ?? column.field}
          {(column.resizable ?? resizable) && onResize && <div className="rosie-grid-resizer" role="separator" aria-orientation="vertical"
            onPointerDown={event => startResize(event, column.field, widths[colIndex])} onClick={event => event.stopPropagation()} />}
        </div>)}
      <div className="rosie-grid-scrollbar-spacer" style={{ width: Rosie.SCROLLBAR_WIDTH }} />
    </div>
  </div>
}
