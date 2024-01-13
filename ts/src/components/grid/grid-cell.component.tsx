import { classNames } from '../../core/utils';
import { GridColumnProps } from './types';


interface GridCellProps extends GridColumnProps {
  value: any,
  rowIndex?: number,
  colIndex?: number,
}

export function GridCell(props: GridCellProps) {
  const { headerName, field, value, rowIndex, colIndex, className, ...others } = props,
        cls = classNames('rosie-grid-cell p-2', className);
  // const { headerName, field, locked, numeric, numericFormat, editable, cellRenderer, item, rowIndex, colIndex, className, ...others } = props,
  //       cls = Ext.classNames('roxie-grid-cell', { 'text-end': numeric }, className),
  //       [fieldValue, setFieldValue] = useState<any>(item?.get(field) ?? ''),
  //       [readOnly, setReadOnly] = useState(true);

  // useEffect(() => { setFieldValue(item?.get(field) ?? ''); }, [props.item])

  // function updateValue() {
  //   item.set(field, fieldValue);
  //   setReadOnly(true);
  // }

  // function getDisplayValue() {
  //   if (numeric && !fieldValue) {
  //     return '_';
  //   } else if (cellRenderer) {
  //     return cellRenderer(fieldValue, item.getData(), rowIndex, colIndex, item);
  //   } else {
  //     return numeric ? Ext.Number.format(fieldValue, numericFormat ?? ',') : fieldValue;
  //   }
  // }

  return <>
    <div className={cls} {...others}>{value}</div>
    {/* {editable && !readOnly && <div className={cls} {...others}>
      <input type="text" className="form-control form-control-sm"
          value={fieldValue} onChange={event => setFieldValue(event.target.value)} onBlur={updateValue} />
    </div>}
    {readOnly && <div className={cls} {...others} onClick={() => setReadOnly(!editable)}>{getDisplayValue()}</div>} */}
  </>
}

// export function GridCheckboxCell(props: { item: DataModel<any>, onChange?: (selectedItem: any) => void }) {
//   const [isSelected, setSelected] = useState(props.item.isSelected || false);

//   function onChange() {
//     const newValue = !isSelected;
//     setSelected(newValue);
//     props.item.isSelected = newValue;
//     props.onChange && props.onChange(props.item);
//   }

//   return <div className="roxie-grid-cell d-flex flex-column text-center">
//     <input type="checkbox" className="form-check-input" checked={isSelected} onChange={onChange} />
//   </div>
// }