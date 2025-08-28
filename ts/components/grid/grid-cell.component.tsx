import { useEffect, useState } from 'react';
import { DataModel, Rosie } from '../../core';
import { GridColumnProps } from './types';

interface GridCellProps extends GridColumnProps {
  record?: DataModel<any>,
  rowIndex?: number,
  colIndex?: number,
  header?: boolean,
}

export function GridCell(props: GridCellProps) {
  const { field, headerName, className, renderer, rowIndex, colIndex, header, ...others } = props,
        cellCls = Rosie.classNames('rosie-grid-cell p-1', className);

  if (header) {
    return <div className={cellCls} {...others}>{headerName ?? field}</div>
  }

  const [fieldValue, setFieldValue] = useState<any>(props.record?.get(field));

  useEffect(() => { setFieldValue(props.record?.get(field)) }, [props.record])

  function getDisplayValue() {
    if (renderer) return renderer(fieldValue, props.record, rowIndex, colIndex);
    return fieldValue;
  }

  return <>
    <div className={Rosie.classNames(cellCls)} {...others}>{getDisplayValue()}</div>
  </>
}