import { Rosie } from '../../core';

type CalendarMonthProps = {
  year: number,
  month: number,
  start?: string,
  end?: string,
  hover?: string,
  onPick: (date: string) => void,
  onHover?: (date: string) => void,
}

export function dayString(year: number, month: number, day: number) {
  return `${year}-${`${month + 1}`.padStart(2, '0')}-${`${day}`.padStart(2, '0')}`;
}

export function CalendarMonth({ year, month, start = '', end = '', hover = '', onPick, onHover }: Readonly<CalendarMonthProps>) {
  const monthStart = new Date(year, month, 1),
        leadingBlanks = (monthStart.getDay() + 6) % 7,
        today = Date.currentDate().format(),
        closing = end || hover,
        [rangeStart, rangeEnd] = start && closing
          ? (start <= closing ? [start, closing] : [closing, start])
          : ['', ''];

  const cells: (number | null)[] = Array(leadingBlanks).fill(null);
  for (let day = 1; day <= monthStart.lengthOfMonth(); day++) cells.push(day);

  return <div className="rosie-date-picker">
    <div className="rosie-date-picker-header">
      <span className="rosie-date-picker-title">{Date.MONTH_NAMES[month]} {year}</span>
    </div>

    <div className="rosie-date-picker-grid">
      {Date.DOW_NAMES.map(name => <div key={name} className="rosie-date-picker-weekday">{name}</div>)}

      {cells.map((day, index) => {
        if (!day) return <div key={`blank-${index}`} className="rosie-date-picker-cell is-blank" />;

        const date = dayString(year, month, day);

        return <div key={date}
                    className={Rosie.classNames('rosie-date-picker-cell', {
                      'is-today': date === today,
                      'is-range-start': date === start,
                      'is-range-end': date === end,
                      'is-in-range': !!rangeStart && date > rangeStart && date < rangeEnd,
                    })}
                    onClick={() => onPick(date)}
                    onMouseEnter={() => onHover?.(date)}>
          {day}
        </div>
      })}
    </div>
  </div>
}
