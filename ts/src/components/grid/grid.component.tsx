import { useState, useEffect, Children } from 'react';
import { SCROLLBAR_WIDTH, classNames, guid } from '../../core/utils';
import { GridColumnProps, GridProps } from './types';
import { GridCell } from './grid-cell.component';

export function GridColumn(_: GridColumnProps) { return null; }

export function Grid(props: GridProps) {
  const [gridId] = useState(guid('rosie-grid-')),
        [columns, setColumns] = useState([] as GridColumnProps[]),
        [data, setData] = useState<any[]>([]);

  // useEffect(() => {
  //   const store$ = props.store?.subscribe(value => setData(value || []));

  //   const scroll$ = Ext.query(`#${gridId} .rosie-grid-body-container`).on('scroll', (event) => {
  //     const body = Ext.query(event.target);
  //     body.siblings('.rosie-grid-header-container').scrollLeft(body.scrollLeft());
  //     Ext.query(`#${gridId} .rosie-grid-locked .rosie-grid-body-container`).scrollTop(body.scrollTop());
  //   });

  //   return () => { store$?.unsubscribe(); scroll$.off('scroll'); }
  // }, [])

  useEffect(() => { setData(props.data ?? []) }, [props.data])

  useEffect(() => {
    const columns = Children.toArray(props.children).map((child: any) => child.props as GridColumnProps);
    setColumns(columns);
  }, [props.children])

  return <div id={gridId} className={classNames('rosie-grid rosie-grid-bordered rosie-grid-striped rosie-grid-hover d-flex flex-row fullscreen', props.className)}>
    <div className="rosie-grid-viewport d-flex flex-column fullscreen">
      <div className={classNames('rosie-grid-header d-flex flex-column fw-bold bg-light')}>
        <div className="rosie-grid-row d-flex flex-row">
          {columns.map((col: GridColumnProps, index) => <GridCell key={index} {...col} value={col.headerName ?? col.field} />)}
          <div style={{width:SCROLLBAR_WIDTH}} />
        </div>
      </div>
      <div className={classNames('rosie-grid-body d-flex flex-column fullscreen overflow-auto-x overflow-scroll-y')}>
        <div>
          {(!data || !data.length) && <div className="p-2">No record found.</div>}
          {data?.length > 0 && data.map((item, rowIndex) => {
            return <div key={rowIndex} className="rosie-grid-row d-flex flex-row">
              {columns.map((col: GridColumnProps, colIndex) => <GridCell key={colIndex} {...col} value={item[col.field]} rowIndex={rowIndex} colIndex={colIndex} />)}
            </div>
          })}
        </div>
      </div>
    </div>
  </div>
}