import { useEffect, useRef, useState } from 'react';
import { Rosie, onEscape, onOutsideClick } from '../../core';
import { PopoverPanel } from '../popover-panel.component';
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
  startUnit?: string,
  endUnit?: string,
}

export const ROLLING_UNIT = { day: 'day', week: 'week', month: 'month', quarter: 'quarter', year: 'year' };

type Preset = { label: string, from: number, to: number, fromUnit?: string, toUnit?: string };

const UNIT_OPTIONS = [
  { name: 'days', value: ROLLING_UNIT.day },
  { name: 'weeks', value: ROLLING_UNIT.week },
  { name: 'months', value: ROLLING_UNIT.month },
  { name: 'quarters', value: ROLLING_UNIT.quarter },
  { name: 'years', value: ROLLING_UNIT.year },
];

const PRESETS: Preset[] = [
  { label: 'Today', from: 0, to: 0 },
  { label: 'Yesterday', from: 1, to: 1 },
  { label: 'Last 7D', from: 7, to: 1 },
  { label: 'Recent 7D', from: 7, to: 0 },
  { label: 'Last 30D', from: 30, to: 1 },
  { label: 'Recent 30D', from: 30, to: 0 },
  { label: 'This Week', from: 0, to: 0, fromUnit: ROLLING_UNIT.week, toUnit: ROLLING_UNIT.week },
  { label: 'Last Week', from: 1, to: 1, fromUnit: ROLLING_UNIT.week, toUnit: ROLLING_UNIT.week },
  { label: 'This Month', from: 0, to: 1, fromUnit: ROLLING_UNIT.month },
  { label: 'Last Month', from: 1, to: 1, fromUnit: ROLLING_UNIT.month, toUnit: ROLLING_UNIT.month },
];

const PANEL_WIDTH_PX = 660;

export const DEFAULT_DATE_RANGE: DateRangeValue = {
  startMode: DATE_MODE.rolling,
  endMode: DATE_MODE.rolling,
  startDaysAgo: 30,
  endDaysAgo: 0,
  startDate: '',
  endDate: '',
  startUnit: ROLLING_UNIT.day,
  endUnit: ROLLING_UNIT.day,
};

type DateRangePickerProps = {
  value: DateRangeValue | null,
  onChange: (value: DateRangeValue) => void,
  placeholder?: string,
  btnClassName?: string,
}

export function resolveStart({ startMode, startDaysAgo, startUnit, startDate }: DateRangeValue) {
  return startMode === DATE_MODE.rolling ? Date.rollingStart(startDaysAgo, startUnit).format() : startDate;
}

export function resolveEnd({ endMode, endDaysAgo, endUnit, endDate }: DateRangeValue) {
  return endMode === DATE_MODE.rolling ? Date.rollingEnd(endDaysAgo, endUnit).format() : endDate;
}

export function formatDateRange(value: DateRangeValue) {
  const start = resolveStart(value),
        end = resolveEnd(value);
  return start === end ? start : `${start || '…'} → ${end || '…'}`;
}

export function DateRangePicker({ value, onChange, placeholder = 'Date range', btnClassName = '' }: Readonly<DateRangePickerProps>) {
  const { open, setOpen, triggerRef, panelRef, panelStyle } = usePopover(undefined, PANEL_WIDTH_PX),
        [draft, setDraft] = useState(value ?? DEFAULT_DATE_RANGE),
        [pickingEnd, setPickingEnd] = useState(false),
        [hoverDate, setHoverDate] = useState(''),
        [visibleMonth, setVisibleMonth] = useState(() => Date.currentDate().startOfMonth().minus(1, 'month'));

  const rangeStart = resolveStart(draft),
        rangeEnd = resolveEnd(draft),
        nextMonth = visibleMonth.plus(1, 'month');

  function unitOf(unit?: string) {
    return unit ?? ROLLING_UNIT.day;
  }

  useEffect(() => {
    if (!open) return;

    setDraft(value ?? DEFAULT_DATE_RANGE);
    setPickingEnd(false);
    setHoverDate('');
  }, [open]);

  function applyPreset(preset: Preset) {
    setDraft(previous => ({ ...previous,
      startMode: DATE_MODE.rolling, endMode: DATE_MODE.rolling,
      startDaysAgo: preset.from, endDaysAgo: preset.to,
      startUnit: unitOf(preset.fromUnit), endUnit: unitOf(preset.toUnit) }));
    setPickingEnd(false);
    setHoverDate('');
  }

  function isPresetActive(preset: Preset) {
    return draft.startMode === DATE_MODE.rolling && draft.endMode === DATE_MODE.rolling
        && draft.startDaysAgo === preset.from && draft.endDaysAgo === preset.to
        && unitOf(draft.startUnit) === unitOf(preset.fromUnit)
        && unitOf(draft.endUnit) === unitOf(preset.toUnit);
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
            dateKey = side === 'start' ? 'startDate' : 'endDate',
            unitKey = side === 'start' ? 'startUnit' : 'endUnit';

      return mode === DATE_MODE.rolling
        ? { ...previous, [modeKey]: mode, [unitKey]: ROLLING_UNIT.day,
            [daysKey]: previous[dateKey] ? Date.daysAgo(previous[dateKey]) : previous[daysKey] }
        : { ...previous, [modeKey]: mode,
            [dateKey]: side === 'start' ? resolveStart(previous) : resolveEnd(previous) };
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

    <PopoverPanel ref={panelRef} style={panelStyle}
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
                  unit = unitOf(side === 'start' ? draft.startUnit : draft.endUnit),
                  daysKey = side === 'start' ? 'startDaysAgo' : 'endDaysAgo',
                  dateKey = side === 'start' ? 'startDate' : 'endDate',
                  unitKey = side === 'start' ? 'startUnit' : 'endUnit';

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
                           name={daysKey} aria-label={`${side} amount`} value={daysAgo}
                           onChange={event => setDraft(previous => ({ ...previous, [daysKey]: Number(event.target.value) }))} />
                    <UnitSelect value={unit} onChange={picked => setDraft(previous => ({ ...previous, [unitKey]: picked }))} />
                    <span className="text-muted">ago</span>
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
    </PopoverPanel>
  </div>
}

type UnitSelectProps = {
  value: string,
  onChange: (unit: string) => void,
}

// rosie's own Dropdown anchors its menu with position: fixed, which resolves against the picker
// panel rather than the viewport because the panel's backdrop-filter makes it a containing block.
// Inside a glass surface the menu has to stay in flow.
function UnitSelect({ value, onChange }: Readonly<UnitSelectProps>) {
  const [open, setOpen] = useState(false),
        rootRef = useRef<HTMLDivElement>(null);

  const selected = UNIT_OPTIONS.find(option => option.value === value) ?? UNIT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    const releaseEscape = onEscape(() => setOpen(false)),
          releaseOutsideClick = onOutsideClick([rootRef.current], () => setOpen(false));

    return () => {
      releaseEscape();
      releaseOutsideClick();
    };
  }, [open]);

  function pick(unit: string) {
    onChange(unit);
    setOpen(false);
  }

  return <div ref={rootRef} className="dropdown">
    <button type="button" aria-haspopup="listbox" aria-expanded={open}
            className={Rosie.classNames('dropdown-btn dropdown-btn-sm', { show: open })}
            onClick={() => setOpen(!open)}>
      <span className="dropdown-placeholder has-value">{selected.name}</span>
      <i className="rosie-icon rosie-icon-chevron-down" />
    </button>

    <div className={Rosie.classNames('dropdown-menu', { show: open })}>
      {UNIT_OPTIONS.map(option =>
        <button key={option.value} type="button" onClick={() => pick(option.value)}
                className={Rosie.classNames('dropdown-item', { active: option.value === value })}>
          {option.name}
        </button>)}
    </div>
  </div>
}

function exactRange(previous: DateRangeValue, [startDate, endDate]: [string, string]): DateRangeValue {
  return { ...previous, startMode: DATE_MODE.exact, endMode: DATE_MODE.exact, startDate, endDate };
}
