import { CSSProperties, Fragment, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { DataStore, Rosie } from '../core';
import { usePopover } from './use-popover';

export type DropdownOption = {
  name: string,
  value: any,
}

export type DropdownDivider = { divider: true };

export const dropdownDivider: DropdownDivider = { divider: true };

export type DropdownHeader = {
  header: true,
  label: string,
  count?: number,
}

export const dropdownHeader = (label: string, count?: number): DropdownHeader => ({ header: true, label, count });

export type DropdownProps<T = any> = {
  options?: (T | DropdownDivider | DropdownHeader)[],
  store?: DataStore<T>,
  value?: T[],
  onChange?: (value: T[]) => void,
  displayField?: string,
  valueField?: string,
  renderer?: (option: T) => ReactNode,
  triggerRenderer?: (option: T) => ReactNode,
  multiple?: boolean,
  placeholder?: string,
  searchable?: boolean,
  disabled?: boolean,
  label?: string,
  menuAlign?: 'start' | 'end',
  className?: string,
  btnClassName?: string,
  style?: CSSProperties,
}

type DropdownEntry<T> = T | DropdownDivider | DropdownHeader;

function isDivider(option: any): option is DropdownDivider { return option?.divider === true }

function isHeader(option: any): option is DropdownHeader { return option?.header === true }

export function Dropdown<T = any>({ className, style, ...props }: Readonly<DropdownProps<T>>) {
  return <div className={Rosie.classNames('dropdown', className, { disabled: !!props.disabled })} style={style}>
    <InputDropdown<T> {...props} />
  </div>
}

export function InputDropdown<T = any>({
  options = [],
  store,
  value = [],
  onChange,
  valueField = 'value',
  displayField = 'name',
  renderer,
  triggerRenderer,
  multiple = false,
  placeholder = 'Select',
  searchable = false,
  disabled = false,
  label,
  menuAlign,
  className = '',
  btnClassName = '',
  style,
}: Readonly<DropdownProps<T>>) {
  const { open, setOpen, triggerRef, panelRef, panelStyle } = usePopover(menuAlign),
        [search, setSearch] = useState(''),
        [collapsed, setCollapsed] = useState<Set<string>>(new Set()),
        [selectedOnOpen, setSelectedOnOpen] = useState<Set<any>>(new Set()),
        [records, setRecords] = useState<DropdownEntry<T>[]>([]),
        searchRef = useRef<HTMLInputElement>(null);

  const keyOf = (option: any) => option?.[valueField],
        labelOf = (option: any) => (option?.[displayField] as string) ?? '',
        selectable = records.filter((o): o is T => !isDivider(o) && !isHeader(o)),
        isSelected = (option: T) => value.some(item => keyOf(item) === keyOf(option)),
        matchesSearch = (option: T) => !search || labelOf(option).toLowerCase().includes(search.toLowerCase()),
        grouped = multiple || records.some(isHeader),
        visible = selectable.filter(matchesSearch),
        chosenCount = visible.filter(isSelected).length,
        triggerText = label ?? (value.length ? value.map(item => labelOf(item)).join(', ') : placeholder);

  useEffect(() => {
    if (store) return;

    setRecords(options);
  }, []);

  useEffect(() => {
    if (!store) return;

    const subscription = store.subscribe(loaded => setRecords((loaded ?? []).map(record => record.value)));
    return () => subscription.unsubscribe();
  }, [store]);

  useEffect(() => {
    if (!open) {
      setSearch('');
      return;
    }

    setSelectedOnOpen(new Set(value.map(keyOf)));
    searchRef.current?.focus();
  }, [open]);

  function toggleCollapse(sectionLabel: string) {
    setCollapsed(previous => {
      const next = new Set(previous);
      next.has(sectionLabel) ? next.delete(sectionLabel) : next.add(sectionLabel);
      return next;
    });
  }

  function select(option: T) {
    if (!multiple) {
      onChange?.([option]);
      setOpen(false);
      return;
    }

    onChange?.(isSelected(option)
      ? value.filter(item => keyOf(item) !== keyOf(option))
      : selectable.filter(item => isSelected(item) || keyOf(item) === keyOf(option)));
  }

  function toggleAll() {
    const scope = new Set(visible.map(keyOf));

    onChange?.(visible.every(isSelected)
      ? value.filter(item => !scope.has(keyOf(item)))
      : selectable.filter(item => isSelected(item) || scope.has(keyOf(item))));
  }

  const optionItem = (option: T) =>
    <OptionItem key={keyOf(option)} label={labelOf(option)} selected={isSelected(option)} onSelect={() => select(option)}>
      {renderer?.(option)}
    </OptionItem>;

  const list = grouped
    ? <GroupedOptions records={records} keyOf={keyOf} matchesSearch={matchesSearch} selectedOnOpen={selectedOnOpen}
                      search={search} collapsed={collapsed} onToggleCollapse={toggleCollapse} optionItem={optionItem} />
    : records.map((option, index) => {
        if (isDivider(option)) return <div key={`divider-${index}`} className="dropdown-divider" />;
        if (isHeader(option)) return null;
        return matchesSearch(option) ? optionItem(option) : null;
      });

  return <Fragment>
    <button ref={triggerRef} type="button" disabled={disabled} style={style}
            aria-haspopup="listbox" aria-expanded={open}
            className={Rosie.classNames('dropdown-btn', className, btnClassName, { show: open })}
            onClick={() => setOpen(!open)}>
      <span className={Rosie.classNames('dropdown-placeholder', { 'has-value': !!value.length })}>
        {triggerRenderer ? triggerRenderer(value[0]) : triggerText}
      </span>
      <i className="rosie-icon rosie-icon-chevron-down" />
    </button>

    <div ref={panelRef} role="listbox" style={panelStyle}
         className={Rosie.classNames('dropdown-menu', { show: open, 'dropdown-menu-end': menuAlign === 'end' })}>
      {searchable && <div className="dropdown-search">
        <input ref={searchRef} type="text" name="search" aria-label="Search options"
               placeholder="Search…" value={search}
               onChange={event => setSearch(event.target.value)} />
      </div>}

      {multiple && !!visible.length && <div className="dropdown-item dropdown-select-all" onClick={toggleAll}>
        <span className="dropdown-item-label">Select all{search ? ` (${visible.length})` : ''}</span>
        {chosenCount > 0 && <i className={`rosie-icon rosie-icon-${chosenCount === visible.length ? 'check' : 'minus'}`} />}
      </div>}

      {!records.length && <div className="dropdown-empty">No options</div>}
      {!!records.length && <div className="dropdown-list">{list}</div>}
    </div>
  </Fragment>
}

function OptionItem({ label, selected, onSelect, children }: Readonly<{ label: string, selected: boolean, onSelect: () => void, children?: ReactNode }>) {
  return <div role="option" aria-selected={selected} onClick={onSelect}
              className={Rosie.classNames('dropdown-item', { active: selected })}>
    <span className="dropdown-item-label" title={label}>{children ?? label}</span>
    {selected && <i className="rosie-icon rosie-icon-check" />}
  </div>
}

function SectionHeader({ label, count, collapsed, onToggle }: Readonly<{ label: string, count?: number, collapsed: boolean, onToggle: () => void }>) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onToggle();
  };

  return <div className="dropdown-section" onClick={handleClick}>
    <span>{label}{count != null ? ` (${count})` : ''}</span>
    <i className={`rosie-icon rosie-icon-chevron-${collapsed ? 'down' : 'up'}`} />
  </div>
}

type GroupedOptionsProps<T> = {
  records: DropdownEntry<T>[],
  keyOf: (option: T) => any,
  matchesSearch: (option: T) => boolean,
  selectedOnOpen: Set<any>,
  search: string,
  collapsed: Set<string>,
  onToggleCollapse: (label: string) => void,
  optionItem: (option: T) => ReactNode,
}

function GroupedOptions<T>({ records, keyOf, matchesSearch, selectedOnOpen, search, collapsed, onToggleCollapse, optionItem }: Readonly<GroupedOptionsProps<T>>) {
  const sections = toSections(records),
        wasSelected = (option: T) => selectedOnOpen.has(keyOf(option)),
        chosen = sections.flatMap(section => section.items).filter(option => wasSelected(option) && matchesSearch(option)),
        hasRest = sections.some(section => section.items.some(option => !wasSelected(option) && matchesSearch(option)));

  return <Fragment>
    {chosen.map(optionItem)}
    {!!chosen.length && hasRest && <div className="dropdown-divider" />}

    {sections.map((section, index) => {
      const rest = section.items.filter(option => !wasSelected(option) && matchesSearch(option));
      if (!rest.length) return null;

      const header = section.header,
            isCollapsed = !!header && !search && collapsed.has(header.label);

      return <Fragment key={`section-${index}`}>
        {header && !search && <SectionHeader label={header.label} count={header.count} collapsed={isCollapsed}
                                             onToggle={() => onToggleCollapse(header.label)} />}
        {!isCollapsed && rest.map(optionItem)}
      </Fragment>
    })}
  </Fragment>
}

function toSections<T>(records: DropdownEntry<T>[]) {
  const sections: { header: DropdownHeader | null, items: T[] }[] = [];
  let current: { header: DropdownHeader | null, items: T[] } | null = null;

  for (const option of records) {
    if (isDivider(option)) continue;

    if (isHeader(option)) {
      current = { header: option, items: [] };
      sections.push(current);
      continue;
    }

    if (!current) {
      current = { header: null, items: [] };
      sections.push(current);
    }
    current.items.push(option as T);
  }

  return sections;
}
