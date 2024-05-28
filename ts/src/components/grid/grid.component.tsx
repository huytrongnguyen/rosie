import { useState, useEffect, Children } from 'react';
import { Rosie } from '../../core';
import { DataModel } from '../../data';
import { PagingToolbar } from '../paging-toolbar.component';
import { GridColumnProps, GridProps } from './types';
import { GridRow } from './grid-row.component';
import { GridCell } from './grid-cell.component';

export function GridColumn(_: GridColumnProps): any { return null; }

export function Grid(props: GridProps) {
  const [gridId] = useState(Rosie.guid('rosie-grid-')),
        [columns, setColumns] = useState([] as GridColumnProps[]),
        [currentPage, setCurrentPage] = useState(1),
        [allSelected, setAllSelected] = useState(false),
        [records, setRecords] = useState<DataModel<any>[]>([]),
        [rawData, setRawData] = useState<DataModel<any>[]>([]);

  useEffect(() => {
    const store$ = props.store?.subscribe(value => setRawData(value || []));

    const body = document.querySelector(`#${gridId} .rosie-grid-body`);
    body.addEventListener('scroll', () => {
      document.querySelector(`#${gridId} .rosie-grid-header`).scrollLeft = body.scrollLeft;
    });

    return () => { store$?.unsubscribe(); }
  }, [])

  useEffect(() => { !props.store && setRawData((props.data ?? []).map(DataModel.create)) }, [props.data])

  useEffect(() => {
    const columns = Children.toArray(props.children).map((child: any) => child.props as GridColumnProps);
    setColumns(columns);
  }, [props.children])

  useEffect(() => { records.forEach(record => { record.selected = allSelected; }) }, [allSelected])

  useEffect(() => {
    if (!rawData?.length || !currentPage) return;

    if (!props.pagingToolbar) {
      setRecords([...rawData]);
    } else {
      const { pageSize = 25 } = props.pagingToolbar,
            data = rawData.take(pageSize, pageSize * (currentPage - 1));
      setRecords([...data]);
    }
  }, [rawData, currentPage])

  return <>
    <div id={gridId} className={Rosie.classNames('rosie-grid d-flex flex-row', { fullscreen: props.fitScreen || props.fitHeight }, props.className)}>
      <div className="rosie-grid-viewport d-flex flex-column fullscreen">
        <div className={Rosie.classNames('rosie-grid-header overflow-hidden fw-bold bg-light d-flex', { 'flex-column': props.fitScreen || props.fitWidth })}>
          <div className="rosie-grid-row d-flex flex-row">
            {props.checkboxSelection && <>
              <div className="rosie-grid-cell p-1">
                <div className="form-check mb-0">
                  <input className="form-check-input" type="checkbox" checked={allSelected} onChange={() => setAllSelected(!allSelected)} />
                </div>
              </div>
            </>}
            {/* {props.checkboxSelection && <div className="rosie-grid-cell p-2">
              <div className="form-check mb-0"><input className="form-check-input" type="checkbox" checked={allSelected} onChange={() => setAllSelected(!allSelected)} /></div>
            </div>} */}
            {columns.map((col: GridColumnProps, index) => <GridCell header key={index} {...col} />)}
            <div style={{width:Rosie.SCROLLBAR_WIDTH}} />
          </div>
        </div>
        <div className={Rosie.classNames('rosie-grid-body fullscreen overflow-x-auto d-flex', { 'flex-column': props.fitScreen || props.fitWidth, 'overflow-y-scroll': !props.fitWidth })}>
          <div>
            {(!records?.length) && <div className="p-2">No record found.</div>}
            {(records?.length > 0) && records.map((record, rowIndex) => {
              return <GridRow key={rowIndex} record={record} rowIndex={rowIndex} columns={columns} checkboxSelection={props.checkboxSelection} />
            })}
          </div>
        </div>
        {(props.bbar || props.pagingToolbar) && <>
          <div className="rosie-grid-footer bg-light border-top d-flex flex-row p-2">
            {props.pagingToolbar && <>
              <div className="ms-auto">
                <PagingToolbar data={rawData} onChange={setCurrentPage} />
              </div>
            </>}
          </div>
        </>}
      </div>
    </div>
  </>
}