import { useState, useEffect } from 'react';
import { Rosie } from '../../core';
import { GridColumnProps, GridRowProps } from './types';
import { GridCell } from './grid-cell.component';

export function GridRow(props: GridRowProps) {
  const { record, rowIndex, columns, checkboxSelection } = props,
        [selected, setSelected] = useState(false);

  // useEffect(() => {
  //   if (record) {
  //     record.on('select', () => {
  //       setSelected(record?.selected ?? false);
  //     });
  //     record.trigger('select');
  //   }
  // }, [record])

  return <>
    <div className={Rosie.classNames('rosie-grid-row d-flex flex-row', { selected })}>
      {/* {checkboxSelection && <>
        <div className="rosie-grid-cell p-1">
          <div className="form-check mb-0">
            <input className="form-check-input" type="checkbox" checked={selected} onChange={() => { record.selected = !selected; }} />
          </div>
        </div>
      </>} */}
      {columns.map((col: GridColumnProps, colIndex) => <GridCell key={colIndex} record={record} rowIndex={rowIndex} colIndex={colIndex} {...col} />)}
    </div>
  </>
}