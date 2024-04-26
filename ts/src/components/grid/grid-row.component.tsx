import { useState, useEffect } from 'react';
import { DataModel } from '../../data';
import { GridColumnProps } from './types';
import { GridCell } from './grid-cell.component';

export function GridRow(props: { record: DataModel<any>, rowIndex: number, columns: GridColumnProps[], checkboxSelection?: boolean, onSelectionChange?: (record: DataModel<any>) => void }) {
  const { record, rowIndex, columns, checkboxSelection, onSelectionChange } = props,
        [selected, setSelected] = useState(false);

  useEffect(() => {
    record.selected = selected;
    onSelectionChange && onSelectionChange(record);
  }, [selected])

  return <div key={rowIndex} className="rosie-grid-row d-flex flex-row">
    {checkboxSelection && <div className="rosie-grid-cell p-2">
      <div className="form-check mb-0">
        <input className="form-check-input" type="checkbox" checked={selected} onChange={() => { setSelected(!selected); }} />
      </div>
    </div>}
    {columns.map((col: GridColumnProps, colIndex) => <GridCell key={colIndex} {...col} record={record} rowIndex={rowIndex} colIndex={colIndex} />)}
  </div>
}