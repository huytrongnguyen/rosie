import { Rosie } from '../core';

export type SegmentedControlOption<T = any> = {
  name: string,
  value: T,
  title?: string,
  icon?: string,
  disabled?: boolean,
}

export type SegmentedControlProps<T = any> = {
  options: SegmentedControlOption<T>[],
  value?: T,
  onChange?: (value: T) => void,
  size?: 'sm' | 'lg',
  variant?: string,
  vertical?: boolean,
  disabled?: boolean,
  label?: string,
  className?: string,
}

/** One choice out of a few, as a Bootstrap button group: the chosen button is active. */
export function SegmentedControl<T = any>({
  options, value, onChange, size, variant = 'primary', vertical = false, disabled = false, label, className,
}: Readonly<SegmentedControlProps<T>>) {
  return <div role="group" aria-label={label}
              className={Rosie.classNames(vertical ? 'btn-group-vertical' : 'btn-group', size && `btn-group-${size}`, className)}>
    {options.map(option => {
      const active = option.value === value;
      return <button key={String(option.value)} type="button" title={option.title} aria-pressed={active}
                     disabled={disabled || option.disabled}
                     className={Rosie.classNames('btn', `btn-outline-${variant}`, { active })}
                     onClick={() => { if (!active) onChange?.(option.value); }}>
        {option.icon && <i className={Rosie.classNames('rosie-icon', `rosie-icon-${option.icon}`, { 'me-1': !!option.name })} />}
        {option.name}
      </button>
    })}
  </div>
}
