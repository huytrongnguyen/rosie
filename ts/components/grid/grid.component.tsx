import { Children, isValidElement, useEffect, useRef, useState } from 'react';
import { DataModel, Rosie, measureColumnWidth } from '../../core';
import { cellStyle } from './grid-cell.component';
import { GridHeader } from './grid-header.component';
import { GridRow } from './grid-row.component';
import { GridColumnProps, GridProps } from './types';

export function GridColumn(_: GridColumnProps): any { return null }

export function Grid({ store, children, className, loading, skeletonRows = 5, empty }: Readonly<GridProps>) {
  const [records, setRecords] = useState<DataModel<any>[]>([]),
        headerRef = useRef<HTMLDivElement>(null),
        bodyRef = useRef<HTMLDivElement>(null),
        columns = toColumns(children),
        widths = columns.map(column => measureColumnWidth(column, records));

  useEffect(() => {
    const subscription = store.subscribe(value => setRecords(value ?? []));
    return () => subscription.unsubscribe();
  }, [store]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const followBodyScroll = () => {
      if (headerRef.current) headerRef.current.scrollLeft = body.scrollLeft;
    };

    body.addEventListener('scroll', followBodyScroll);
    return () => body.removeEventListener('scroll', followBodyScroll);
  }, []);

  return <div className={Rosie.classNames('rosie-grid', className)}>
    <GridHeader ref={headerRef} columns={columns} widths={widths} />

    <div className="rosie-grid-body" ref={bodyRef}>
      {loading && Array.from({ length: skeletonRows }, (_, rowIndex) =>
        <div key={rowIndex} className="rosie-grid-row">
          {columns.map((column, colIndex) =>
            <div key={column.field} className="rosie-grid-cell" style={cellStyle(column, widths[colIndex])}>
              <span className="rosie-skeleton rosie-skeleton-text" />
            </div>)}
        </div>)}

      {!loading && records.map((record, rowIndex) =>
        <GridRow key={rowIndex} columns={columns} widths={widths} record={record} rowIndex={rowIndex} />)}

      {!loading && !records.length && <div className="rosie-grid-empty">
        <div className="rosie-empty-state">
          <div className="rosie-empty-state-title">{empty?.title ?? 'No records'}</div>
          {empty?.desc && <div className="rosie-empty-state-description">{empty.desc}</div>}
        </div>
      </div>}
    </div>
  </div>
}

function toColumns(children: GridProps['children']): GridColumnProps[] {
  return Children.toArray(children).filter(isValidElement).map(child => child.props as GridColumnProps);
}
