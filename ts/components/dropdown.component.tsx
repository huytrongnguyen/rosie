import { useState, useEffect, ReactElement } from 'react';
import { Rosie } from '../core';

type DropdownProps = {
  options?: any[],
  value?: any[],
  onChange?: (value: any[]) => void,
  displayField?: string,
  valueField?: string,
  multiple?: boolean,
  defaultText?: string,
  separator?: string,
  smartButtonText?: boolean,
  rightAligned?: boolean,
  searchBox?: boolean,
  buttonClass?: string,
  buttonStyle?: any,
  className?: string,
  renderer?: (value: any, record: any, index: number) => string | ReactElement,
}

export function Dropdown(props: DropdownProps) {
  const { className = '', buttonClass = '' } = props;

  return <div className={Rosie.classNames('dropdown', className)}>
    <InputDropdown {...props} buttonClass={buttonClass} />
  </div>
}

export function InputDropdown(props: DropdownProps) {
  const {
    displayField = 'name',
    valueField = 'value',
    multiple = false,
    defaultText = 'Select',
    separator = ': ',
    smartButtonText = true,
    rightAligned = false,
    searchBox = true,
    buttonClass = '',
    buttonStyle = {},
  } = props;

  const [searchFilter, setSearchFilter] = useState(''),
        [options, setOptions] = useState(props.options || []),
        [selection, setSelection] = useState(props.value || []);

  useEffect(() => setSelection(props?.value || []), [props.value])
  useEffect(() => setOptions(props?.options || []), [props.options])

  function displayText() {
    if (!smartButtonText || !selection || !selection.length) {
      return defaultText;
    }

    const names = selection.map(item => item?.[displayField] ?? '').join(',');
    return `${defaultText}${separator}${names}`;
  }

  function isSelected(opt: any) {
    return selection.findIndex(item => item[valueField] === opt[valueField]) > -1;
  }

  function select(opt: any) {
    let opts = [];
    if (!multiple) {
      opts = [opt];
    } else if (isSelected(opt)) {
      opts = selection.filter(item => item[valueField] !== opt[valueField]);
    } else {
      opts = options.filter(item => isSelected(item) || item[valueField] === opt[valueField]);
    }
    setSelection(opts);
    props.onChange && props.onChange(opts);
  }

  return <>
    <button type="button" className={Rosie.classNames('btn dropdown-toggle', buttonClass)} style={buttonStyle} data-bs-toggle="dropdown">
      {displayText()}
    </button>
    <div className={Rosie.classNames('dropdown-menu p-0', { 'dropdown-menu-right': rightAligned })}>
      {searchBox && <div className="p-1 border-bottom">
        <input type="text" className="form-control form-control-sm" name="searchFilter" placeholder="Search..."
            value={searchFilter} onChange={event => setSearchFilter(event.target.value)} />
      </div>}
      <div className="dropdown-item-list">
        {options.map((opt, index) => {
          if (searchFilter && !opt[displayField].toLowerCase().startsWith(searchFilter.toLowerCase())) return null;
          return <div role="button" key={opt[valueField]} className={Rosie.classNames('dropdown-item', { active: isSelected(opt) })} onClick={() => select(opt)}>
                {props.renderer ? props.renderer(opt[displayField], opt, index) : opt[displayField]}
          </div>
        })}
      </div>
    </div>
  </>
}