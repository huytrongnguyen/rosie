import { useEffect, useState } from 'react';
import { Rosie } from '../../core';
import { usePopover } from '../use-popover';
import { CalendarMonth } from './calendar-month.component';

export type DatePointValue = {
  mode: string,
  daysAgo: number,
  date: string,
}

export const DATE_MODE = { rolling: 'rolling', exact: 'exact' };

type Preset = { label: string, daysAgo: number };

const PRESETS: Preset[] = [
  { label: 'Today', daysAgo: 0 },
  { label: 'Yesterday', daysAgo: 1 },
  { label: '7D ago', daysAgo: 7 },
  { label: '30D ago', daysAgo: 30 },
];

const PANEL_WIDTH_PX = 460;

type DatePickerProps = {
  value: DatePointValue,
  onChange: (value: DatePointValue) => void,
  placeholder?: string,
  btnClassName?: string,
}

export function resolveDatePoint({ mode, daysAgo, date }: DatePointValue) {
  return mode === DATE_MODE.rolling ? Date.currentDate().minus(daysAgo).format() : date;
}

export function DatePicker({ value, onChange, placeholder = 'YYYY-MM-DD', btnClassName = '' }: Readonly<DatePickerProps>) {
  const { open, setOpen, triggerRef, panelRef, panelStyle } = usePopover(undefined, PANEL_WIDTH_PX),
        [draft, setDraft] = useState(value),
        [visibleMonth, setVisibleMonth] = useState(() => Date.currentDate().startOfMonth());

  const selected = resolveDatePoint(draft);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open]);

  function applyPreset(preset: Preset) {
    setDraft(previous => ({ ...previous, mode: DATE_MODE.rolling, daysAgo: preset.daysAgo }));
  }

  function isPresetActive(preset: Preset) {
    return draft.mode === DATE_MODE.rolling && draft.daysAgo === preset.daysAgo;
  }

  function switchMode(mode: string) {
    setDraft(previous => mode === DATE_MODE.rolling
      ? { ...previous, mode, daysAgo: previous.date ? Date.daysAgo(previous.date) : previous.daysAgo }
      : { ...previous, mode, date: Date.currentDate().minus(previous.daysAgo).format() });
  }

  function apply() {
    onChange(draft);
    setOpen(false);
  }

  return <div className="dropdown">
    <button ref={triggerRef} type="button" aria-haspopup="dialog" aria-expanded={open}
            className={Rosie.classNames('dropdown-btn', btnClassName, { show: open })}
            onClick={() => setOpen(!open)}>
      <span className={Rosie.classNames('dropdown-placeholder', { 'has-value': !!resolveDatePoint(value) })}>
        {resolveDatePoint(value) || placeholder}
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
        <div className="rosie-date-range-field">
          <div className="rosie-date-range-field-head">
            <span className="rosie-date-range-label">Date</span>
            <div className="rosie-date-range-modes">
              <button type="button" onClick={() => switchMode(DATE_MODE.rolling)}
                      className={Rosie.classNames('rosie-date-range-mode', { 'is-active': draft.mode === DATE_MODE.rolling })}>
                Rolling
              </button>
              <button type="button" onClick={() => switchMode(DATE_MODE.exact)}
                      className={Rosie.classNames('rosie-date-range-mode', { 'is-active': draft.mode === DATE_MODE.exact })}>
                Exact
              </button>
            </div>
          </div>

          {draft.mode === DATE_MODE.rolling
            ? <div className="rosie-date-range-rolling">
                <input type="number" min={0} max={730} className="form-control form-control-sm"
                       name="daysAgo" aria-label="Days ago" value={draft.daysAgo}
                       onChange={event => setDraft(previous => ({ ...previous, daysAgo: Number(event.target.value) }))} />
                <span className="text-muted">days ago</span>
              </div>
            : <input type="text" className="form-control form-control-sm" placeholder="YYYY-MM-DD"
                     name="date" aria-label="Date" value={draft.date}
                     onChange={event => setDraft(previous => ({ ...previous, date: event.target.value }))} />}
        </div>

        <div className="rosie-date-range-calendars">
          <button type="button" className="rosie-date-picker-nav-btn" aria-label="Previous month"
                  onClick={() => setVisibleMonth(month => month.minus(1, 'month'))}>
            <i className="rosie-icon rosie-icon-chevron-left" />
          </button>

          <CalendarMonth year={visibleMonth.getFullYear()} month={visibleMonth.getMonth()} start={selected}
                         onPick={date => setDraft(previous => ({ ...previous, mode: DATE_MODE.exact, date }))} />

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
