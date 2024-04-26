import { useEffect, useState } from 'react';
import { Rosie } from '../../core';
import { DataModel } from '../../data';
import { GridColumnProps } from './types';

interface GridCellProps extends GridColumnProps {
  record?: DataModel<any>,
  rowIndex?: number,
  colIndex?: number,
  header?: boolean,
}

export function GridCell(props: GridCellProps) {
  const { field, headerName, className, renderer, record, rowIndex, colIndex, header, ...others } = props,
        cellCls = Rosie.classNames('rosie-grid-cell p-2', className),
        [fieldValue, setFieldValue] = useState<any>(record?.get(field));

  if (header) {
    return <div className={cellCls} {...others}>{headerName ?? field}</div>
  }

  useEffect(() => {
    const record$ = props.record?.subscribe(value => { setFieldValue(value?.[field]); });
    return () => { record$?.unsubscribe(); }
  }, [])

  function getDisplayValue() {
    if (renderer) return renderer(fieldValue, record, rowIndex, colIndex);
    return fieldValue;
  }

  return <>
    <div className={Rosie.classNames(cellCls)} {...others}>{getDisplayValue()}</div>
  </>
}