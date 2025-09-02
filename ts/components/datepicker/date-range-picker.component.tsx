import { useState } from 'react';
import { Rosie } from '../../core';
import { DatePickerInput } from './date-picker.component';

export function DateRangePicker(props: { start: Date, end: Date, className?: string, onChange: (start: Date, end: Date) => void }) {
  const [startDate, setStartDate] = useState(props.start),
        [endDate, setEndDate] = useState(props.end);

  return <div className={Rosie.classNames('input-group', props.className)}>
    <div className="input-group-text"><span className="fa fa-calendar"></span></div>
    <DatePickerInput value={startDate} onChange={setStartDate} />
    <DatePickerInput value={endDate} onChange={setEndDate} />
    <button className="btn btn-outline-secondary" onClick={() => props.onChange(startDate, endDate)}>Apply</button>
  </div>
}