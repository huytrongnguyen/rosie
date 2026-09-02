import { useEffect, useState } from 'react';
import { Rosie } from '../../core';
import { usePopover } from '../use-popover';
import { CalendarMonth } from './calendar-month.component';
import { DATE_MODE } from './date-picker.component';

export type DateRangeValue = {
  startMode: string,
  endMode: string,
  startDaysAgo: number,
  endDaysAgo: number,
  startDate: string,
  endDate: string,
}

type RollingPreset = { label: string, from: number, to: number };
type ExactPreset = { label: string, resolve: () => [string, string] };
type Preset = RollingPreset | ExactPreset;

const WEEK_STARTS_MONDAY = 1;

const PRESETS: Preset[] = [
  { label: 'Today', from: 0, to: 0 },
  { label: 'Yesterday', from: 1, to: 1 },
  { label: 'Last 7D', from: 7, to: 1 },
  { label: 'Recent 7D', from: 7, to: 0 },
  { label: 'Last 30D', from: 30, to: 1 },
  { label: 'Recent 30D', from: 30, to: 0 },
  { label: 'This Week', resolve: () => weekFrom(Date.currentDate()) },
  { label: 'Last Week', resolve: () => weekFrom(Date.currentDate().minus(1, 'week')) },
  { label: 'This Month', resolve: () => [Date.currentDate().startOfMonth().format(), Date.currentDate().format()] },
  { label: 'Last Month', resolve: () => monthOf(Date.currentDate().minus(1, 'month')) },
];

const PANEL_WIDTH_PX = 660;

export const DEFAULT_DATE_RANGE: DateRangeValue = {
  startMode: DATE_MODE.rolling,
  endMode: DATE_MODE.rolling,
  startDaysAgo: 30,
  endDaysAgo: 0,
  startDate: '',
  endDate: '',
};

type DateRangePickerProps = {
  value: DateRangeValue | null,
  onChange: (value: DateRangeValue) => void,
  placeholder?: string,
  btnClassName?: string,
}

function weekFrom(date: Date): [string, string] {
  const start = date.startOfWeek(WEEK_STARTS_MONDAY);
  return [start.format(), start.plus(6).format()];
}

function monthOf(date: Date): [string, string] {
  return [date.startOfMonth().format(), date.endOfMonth().format()];
}

function isRolling(preset: Preset): preset is RollingPreset {
  return (preset as RollingPreset).from !== undefined;
}

function resolvePoint(mode: string, daysAgo: number, date: string) {
  return mode === DATE_MODE.rolling ? Date.currentDate().minus(daysAgo).format() : date;
}

export function formatDateRange(value: DateRangeValue) {
  const start = resolvePoint(value.startMode, value.startDaysAgo, value.startDate),
        end = resolvePoint(value.endMode, value.endDaysAgo, value.endDate);
  return start === end ? start : `${start || '…'} → ${end || '…'}`;
}

export function DateRangePicker({ value, onChange, placeholder = 'Date range', btnClassName = '' }: Readonly<DateRangePickerProps>) {
  const { open, setOpen, triggerRef, panelRef, panelStyle } = usePopover(undefined, PANEL_WIDTH_PX),
        [draft, setDraft] = useState(value ?? DEFAULT_DATE_RANGE),
        [pickingEnd, setPickingEnd] = useState(false),
        [hoverDate, setHoverDate] = useState(''),
        [visibleMonth, setVisibleMonth] = useState(() => Date.currentDate().startOfMonth().minus(1, 'month'));

  const rangeStart = resolvePoint(draft.startMode, draft.startDaysAgo, draft.startDate),
        rangeEnd = resolvePoint(draft.endMode, draft.endDaysAgo, draft.endDate),
        nextMonth = visibleMonth.plus(1, 'month');

  useEffect(() => {
    if (!open) return;

    setDraft(value ?? DEFAULT_DATE_RANGE);
    setPickingEnd(false);
    setHoverDate('');
  }, [open]);

  function applyPreset(preset: Preset) {
    setDraft(previous => isRolling(preset)
      ? { ...previous, startMode: DATE_MODE.rolling, endMode: DATE_MODE.rolling, startDaysAgo: preset.from, endDaysAgo: preset.to }
      : exactRange(previous, preset.resolve()));
    setPickingEnd(false);
    setHoverDate('');
  }

  function isPresetActive(preset: Preset) {
    if (isRolling(preset)) {
      return draft.startMode === DATE_MODE.rolling && draft.endMode === DATE_MODE.rolling
          && draft.startDaysAgo === preset.from && draft.endDaysAgo === preset.to;
    }

    const [start, end] = preset.resolve();
    return draft.startMode === DATE_MODE.exact && draft.endMode === DATE_MODE.exact
        && draft.startDate === start && draft.endDate === end;
  }

  function pickDay(date: string) {
    if (!pickingEnd) {
      setDraft(previous => exactRange(previous, [date, '']));
      setPickingEnd(true);
      return;
    }

    setDraft(previous => exactRange(previous, date >= previous.startDate ? [previous.startDate, date] : [date, previous.startDate]));
    setPickingEnd(false);
    setHoverDate('');
  }

  function switchMode(side: 'start' | 'end', mode: string) {
    setDraft(previous => {
      const modeKey = side === 'start' ? 'startMode' : 'endMode',
            daysKey = side === 'start' ? 'startDaysAgo' : 'endDaysAgo',
            dateKey = side === 'start' ? 'startDate' : 'endDate';

      return mode === DATE_MODE.rolling
        ? { ...previous, [modeKey]: mode, [daysKey]: previous[dateKey] ? Date.daysAgo(previous[dateKey]) : previous[daysKey] }
        : { ...previous, [modeKey]: mode, [dateKey]: Date.currentDate().minus(previous[daysKey]).format() };
    });
    setPickingEnd(false);
    setHoverDate('');
  }

  function apply() {
    onChange(draft);
    setOpen(false);
  }

  return <div className="dropdown">
    <button ref={triggerRef} type="button" aria-haspopup="dialog" aria-expanded={open}
            className={Rosie.classNames('dropdown-btn', btnClassName, { show: open })}
            onClick={() => setOpen(!open)}>
      <span className={Rosie.classNames('dropdown-placeholder', { 'has-value': !!value })}>
        {value ? formatDateRange(value) : placeholder}
      </span>
      <i className="rosie-icon rosie-icon-calendar" />
    </button>

    <div ref={panelRef} style={panelStyle}
         className={Rosie.classNames('dropdown-menu rosie-date-range-picker', { show: open })}>
      <div className="rosie-date-range-presets">
        {PRESETS.map(preset =>
          <button key={preset.label} type="button" onClick={() => applyPreset(preset)}
                  className={Rosie.classNames('rosie-date-range-preset', { 'is-active': isPresetActive(preset) })}>
            {preset.label}
          </button>)}
      </div>

      <div className="rosie-date-range-main">
        <div className="rosie-date-range-fields">
          {(['start', 'end'] as const).map(side => {
            const mode = side === 'start' ? draft.startMode : draft.endMode,
                  daysAgo = side === 'start' ? draft.startDaysAgo : draft.endDaysAgo,
                  date = side === 'start' ? draft.startDate : draft.endDate,
                  daysKey = side === 'start' ? 'startDaysAgo' : 'endDaysAgo',
                  dateKey = side === 'start' ? 'startDate' : 'endDate';

            return <div key={side} className="rosie-date-range-field">
              <div className="rosie-date-range-field-head">
                <span className="rosie-date-range-label">{side === 'start' ? 'Start' : 'End'}</span>
                <div className="rosie-date-range-modes">
                  <button type="button" onClick={() => switchMode(side, DATE_MODE.rolling)}
                          className={Rosie.classNames('rosie-date-range-mode', { 'is-active': mode === DATE_MODE.rolling })}>
                    Rolling
                  </button>
                  <button type="button" onClick={() => switchMode(side, DATE_MODE.exact)}
                          className={Rosie.classNames('rosie-date-range-mode', { 'is-active': mode === DATE_MODE.exact })}>
                    Exact
                  </button>
                </div>
              </div>

              {mode === DATE_MODE.rolling
                ? <div className="rosie-date-range-rolling">
                    <input type="number" min={0} max={730} className="form-control form-control-sm"
                           name={daysKey} aria-label={`${side} days ago`} value={daysAgo}
                           onChange={event => setDraft(previous => ({ ...previous, [daysKey]: Number(event.target.value) }))} />
                    <span className="text-muted">days ago</span>
                  </div>
                : <input type="text" className="form-control form-control-sm" placeholder="YYYY-MM-DD"
                         name={dateKey} aria-label={`${side} date`} value={date}
                         onChange={event => setDraft(previous => ({ ...previous, [dateKey]: event.target.value }))} />}
            </div>
          })}
        </div>

        <div className="rosie-date-range-calendars">
          <button type="button" className="rosie-date-picker-nav-btn" aria-label="Previous month"
                  onClick={() => setVisibleMonth(month => month.minus(1, 'month'))}>
            <i className="rosie-icon rosie-icon-chevron-left" />
          </button>

          <CalendarMonth year={visibleMonth.getFullYear()} month={visibleMonth.getMonth()}
                         start={rangeStart} end={rangeEnd} hover={hoverDate}
                         onPick={pickDay} onHover={date => pickingEnd && setHoverDate(date)} />

          <CalendarMonth year={nextMonth.getFullYear()} month={nextMonth.getMonth()}
                         start={rangeStart} end={rangeEnd} hover={hoverDate}
                         onPick={pickDay} onHover={date => pickingEnd && setHoverDate(date)} />

          <button type="button" className="rosie-date-picker-nav-btn" aria-label="Next month"
                  onClick={() => setVisibleMonth(month => month.plus(1, 'month'))}>
            <i className="rosie-icon rosie-icon-chevron-right" />
          </button>
        </div>

        <div className="rosie-date-range-footer">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setOpen(false)}>Cancel</button>
          <button type="button" className="btn btn-primary btn-sm" onClick={apply}>Apply</button>
        </div>
      </div>
    </div>
  </div>
}

function exactRange(previous: DateRangeValue, [startDate, endDate]: [string, string]): DateRangeValue {
  return { ...previous, startMode: DATE_MODE.exact, endMode: DATE_MODE.exact, startDate, endDate };
}
