import { useEffect, useState } from 'react';
import { InputDropdown } from '../dropdown.component';
import { compareOperators, CriteriaField } from './type';

type CriteriaFieldComponentProps = {
  field: CriteriaField,
  index: number,
  criteria: CriteriaField[],
  onChange: (field: CriteriaField, index: number) => void,
}

export function CriteriaFieldComponent(props: CriteriaFieldComponentProps) {
  const [value, setValue] = useState(props.field.value);

  useEffect(() => {
    props.onChange({ ...props.field, value }, props.index);
  }, [value])

  return <div className="input-group">
    <InputDropdown options={props.criteria}
        value={[props.field]} onChange={(fields) => props.onChange(fields[0], props.index)} />
    <InputDropdown options={compareOperators}
        value={[props.field.operator]} onChange={(fields) => props.onChange(fields[0], props.index)} />
    <input type="text" className="form-control" value={value} onChange={e => setValue(e.target.value)} />
  </div>
}