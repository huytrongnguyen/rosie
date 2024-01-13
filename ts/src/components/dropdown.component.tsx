import { useState, useEffect, ReactElement, Fragment } from 'react';
import { classNames } from '../core/utils';

type DropdownProps = {
  options: any[],
  value: any[],
  onChange?: (value: any[]) => void,
  displayField?: string,
  valueField?: string,
  multiple?: boolean,
  defaultText?: string,
  separator?: string,
  // smartButtonText?: boolean,
  rightAligned?: boolean,
  searchBox?: boolean,
  buttonClass?: string,
  buttonStyle?: any,
  className?: string,
  entireList?: boolean,
  itemRenderer?: (value: any, record: any, index: number) => ReactElement,
  renderer?: (value: any, record: any, index: number) => string | ReactElement,
}

export function Dropdown(props: DropdownProps) {
  const { displayField = 'name', valueField = 'value', entireList = false } = props,
        [searchFilter, setSearchFilter] = useState(''),
        [options, setOptions] = useState(props.options || []),
        [selection, setSelection] = useState(props.value || []);

  useEffect(() => setSelection(props?.value || []), [props.value])
  useEffect(() => setOptions(props?.options || []), [props.options])

  function displayText() {
    return `${props.defaultText ?? 'Select'}${props.separator ?? ': '}${selection.map(item => item[displayField]).join(',')}`;
  }

  function isSelected(opt: any) {
    return selection.findIndex(item => item[valueField] === opt[valueField]) > -1;
  }

  function select(opt: any) {
    let opts = [];
    if (!props.multiple) {
      opts = [opt];
    } else if (isSelected(opt)) {
      opts = selection.filter(item => item[valueField] !== opt[valueField]);
    } else {
      opts = options.filter(item => isSelected(item) || item[valueField] === opt[valueField]);
    }
    setSelection(opts);
    props.onChange && props.onChange(opts);
  }

  return <div className={classNames('dropdown', props.className)}>
    <span className={classNames('dropdown-toggle cursor-pointer', props.buttonClass)} style={props.buttonStyle} data-bs-toggle="dropdown">
      {displayText()}
    </span>
    <div className={classNames('dropdown-menu p-0', { 'dropdown-menu-right': props.rightAligned })}>
      {props.searchBox && <div className="p-1 border-bottom">
        <input type="text" className="form-control form-control-sm" name="searchFilter" placeholder="Search..."
            value={searchFilter} onChange={event => setSearchFilter(event.target.value)} />
      </div>}
      <div className={classNames({ 'dropdown-item-list': !entireList })}>
        {options.map((opt, index) => {
          if (searchFilter && !opt[displayField].toLowerCase().startsWith(searchFilter.toLowerCase())) return null;
          if (props.itemRenderer) {
            return <Fragment key={opt[valueField]}>{props.itemRenderer(opt[displayField], opt, index)}</Fragment>
          }
          return <div key={opt[valueField]} onClick={() => select(opt)} role="button"
                      className={classNames('dropdown-item', { active: isSelected(opt) })}>
            {props.renderer ? props.renderer(opt[displayField], opt, index) : opt[displayField]}
          </div>
        })}
      </div>
    </div>
  </div>
}
