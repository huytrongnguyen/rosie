import { useState, useEffect } from 'react';
import { Rosie } from '../core';

type DatePickerComponentProps = {
  dateFormat?: string,
  value: Date,
  onChange: (value: Date) => void,
  className?: string,
}

export function DatePickerComponent(props: DatePickerComponentProps) {
  const [datePickerId] = useState(Rosie.guid('datepicker-')),
        [dateFormat] = useState(props.dateFormat || 'yyyy-MM-dd'),
        [date, setDate] = useState(props.value),
        [dateStr, setDateStr] = useState(date?.format(dateFormat) ?? '');

  useEffect(() => { setDate(props.value) }, [props.value]);
  useEffect(() => { setDateStr(date?.format(dateFormat) ?? ''); }, [date]);

  function onChangeTextBox() {
    const newDate = dateStr.parseDate();
    if (Rosie.isDate(newDate)) {
      setDate(newDate);
      onChange(newDate);
    }
  }

  function onChange(newDate: Date) {
    props.onChange(newDate);
    // Ext.query(`#${datePickerId} .dropdown-toggle`).removeClass('show');
    // Ext.query(`#${datePickerId} .dropdown-menu`).removeClass('show');
  }


  return <div id={datePickerId} className="dropdown">
    <input type="text" className="form-control form-control-sm text-center dropdown-toggle"
        data-bs-toggle="dropdown" data-bs-auto-close="outside"
        value={dateStr} onChange={e => setDateStr(e.target.value)} onKeyUp={e => e.key === 'Enter' && onChangeTextBox()} />
    <div className="dropdown-menu dropdown-menu-end p-0">
      <DatePickerPortal value={date} onChange={onChange} />
    </div>
  </div>
}

type DatePickerPortalProps = {
  value: Date,
  onChange: (value: Date) => void,
}

export function DatePickerPortal(props: DatePickerPortalProps) {
  const [viewDate, setViewDate] = useState(null as unknown as Date),
        [calendar, setCalendar] = useState([] as number[][]);

  useEffect(() => {
    const { value } = props;
    value && setViewDate(new Date(value.getFullYear(), value.getMonth(), 1));
  }, [props.value])

  useEffect(() => {
    if (!viewDate) return;

    const daysInWeek = 7,
          weeksInMonth = viewDate.getWeeksInMonth(),
          firstDayOfMonth = viewDate.getDay(),
          lastDayOfMonth = viewDate.endOfMonth().getDay(),
          daysInPreviousMonth = viewDate.minus(1, 'month').lengthOfMonth(),
          calendar = [] as number[][];

    for (let week = 0, counter = 0; week < weeksInMonth; ++week) {
      calendar[week] = [];
      for (let day = 0; day < daysInWeek; ++day) {
        if (week === 0) {
          if (day < firstDayOfMonth) {
            calendar[week][day] = firstDayOfMonth - day - 1 - daysInPreviousMonth;
          } else {
            calendar[week][day] = ++counter;
          }
        } else if (week === weeksInMonth - 1) {
          if (day > lastDayOfMonth) {
            calendar[week][day] = lastDayOfMonth - day;
          } else {
            calendar[week][day] = ++counter;
          }
        } else {
          calendar[week][day] = ++counter;
        }
      }
    }

    setCalendar(calendar);
  }, [viewDate])

  function update(day: number) {
    let date = props.value;
    if (day > 0) { // current month
      date = viewDate.plus(day - 1);
    } else if (0 > day && day > -7) { // next month
      date = viewDate.plus(1, 'month');
      date = date.plus(Math.abs(day) - 1);
    } else { // previous month
      const daysInPreviousMonth = viewDate.minus(1, 'month').lengthOfMonth();
      date = viewDate.minus(day + daysInPreviousMonth + 1);
    }

    props.onChange(date);
  }

  return <div className="rosie-datepicker-portal card border-0 mb-0">
    <div className="card-header p-0">
      <div className="d-flex justify-content-between">
        <div className="rosie-datepicker-cell border-0 btn btn-sm cursor-pointer d-flex align-items-center justify-content-center" onClick={() => setViewDate(viewDate.minus(1, 'month'))}>
          <i className="fa fa-caret-left" />
        </div>
        <div className="rosie-datepicker-title font-weight-bold d-flex align-items-center">
          {viewDate && viewDate.format('yyyy-MM')}
        </div>
        <div className="rosie-datepicker-cell border-0 btn btn-sm cursor-pointer d-flex align-items-center justify-content-center" onClick={() => setViewDate(viewDate.plus(1, 'month'))}>
          <i className="fa fa-caret-right" />
        </div>
      </div>
      <div className="d-flex flex-row">
        <div className="rosie-datepicker-cell text-center p-2"><span className="align-middle">Su</span></div>
        <div className="rosie-datepicker-cell text-center p-2"><span className="align-middle">Mo</span></div>
        <div className="rosie-datepicker-cell text-center p-2"><span className="align-middle">Tu</span></div>
        <div className="rosie-datepicker-cell text-center p-2"><span className="align-middle">We</span></div>
        <div className="rosie-datepicker-cell text-center p-2"><span className="align-middle">Th</span></div>
        <div className="rosie-datepicker-cell text-center p-2"><span className="align-middle">Fr</span></div>
        <div className="rosie-datepicker-cell text-center p-2"><span className="align-middle">Sa</span></div>
      </div>
    </div>
    <div className="card-body p-0">
      {calendar.map((week, weekIdx) => <div key={weekIdx} className="d-flex flex-row">
        {week.map((day, dayIdx) => {
          const selected = day > 0 && props.value.equals(new Date(viewDate.getFullYear(), viewDate.getMonth(), day)),
                className = Rosie.classNames(
                  'rosie-datepicker-cell rosie-datepicker-hover border-0 btn btn-sm',
                  {
                    'text-muted': day < 0,
                    'btn-primary': selected,
                  }
                );

          return <button type="button" key={dayIdx} className={className} onClick={() => update(day)}>{day.abs()}</button>
        })}
      </div>)}
    </div>
  </div>
}

type DatePickerProps = {
  value: Date,
  onChange: (value: Date) => void,
  dateFormat?: string,
}

export function DatePicker(props: DatePickerProps) {
  const [value, setValue] = useState(Date.currentDate());

  useEffect(() => { props.value && setValue(props.value); }, [props.value])

  return <div className="rosie-datepicker input-group input-group-sm">
    <div className="input-group-text"><span className="fa fa-calendar-days" /></div>
    <DatePickerComponent value={value} onChange={props.onChange} dateFormat={props.dateFormat} />
  </div>
}

type DateRangePickerProps = {
  startDate: Date,
  endDate: Date,
  buttonText?: string,
  onChange: (startDate: Date, endDate: Date) => void,
}

export function DateRangePicker(props: DateRangePickerProps) {
  const [startDate, setStartDate] = useState(props.startDate),
        [endDate, setEndDate] = useState(props.endDate);

  useEffect(() => { setStartDate(props.startDate) }, [props.startDate]);
  useEffect(() => { setEndDate(props.endDate) }, [props.endDate]);

  return <div className="rosie-datepicker date-range input-group input-group-sm">
    <div className="input-group-text"><span className="fa fa-calendar-days" /></div>
    <DatePickerComponent value={startDate} onChange={setStartDate} />
    <DatePickerComponent value={endDate} onChange={setEndDate} />
    <button type="button" className="btn btn-sm btn-primary rosie-daterangepicker-action" onClick={() => props.onChange(startDate, endDate)}>{props.buttonText ?? 'Apply'}</button>
  </div>
}
