import { useEffect, useState } from 'react';
import { Rosie } from '../../core';

export function DatePicker(props: { value: Date, className?: string, onChange: (value: Date) => void }) {
  const [value, setValue] = useState(props.value);

  return <div className={Rosie.classNames('input-group', props.className)}>
    <div className="input-group-text"><span className="fa fa-calendar"></span></div>
    <DatePickerInput value={props.value} onChange={setValue} />
    <button className="btn btn-outline-secondary" onClick={() => props.onChange(value)}>Apply</button>
  </div>
}

export function DatePickerInput(props: { value: Date, onChange: (value: Date) => void }) {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => { setDateStr((props.value ?? Date.currentDate()).format()) }, [props.value])

  return <>
    <input type="text" className="form-control text-center" value={dateStr}
        onChange={e => setDateStr(e.target.value)} onBlur={() => props.onChange(Date.parseDate(dateStr))} />
  </>
}