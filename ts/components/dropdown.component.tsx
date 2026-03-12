import { useState, useEffect, ReactElement, CSSProperties } from 'react';
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
  buttonStyle?: CSSProperties,
  menuClass?: string,
  menuStyle?: CSSProperties,
  itemClass?: string,
  itemStyle?: CSSProperties,
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
    smartButtonText = true,
    rightAligned = false,
    searchBox = true,
    buttonClass = '',
    buttonStyle = {},
    menuClass = '',
    menuStyle = {},
    itemClass = '',
    itemStyle = {},
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

    return selection.map(item => item?.[displayField] ?? '').join(',');
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
    <div className={Rosie.classNames('dropdown-menu p-0', menuClass, { 'dropdown-menu-right': rightAligned })} style={menuStyle}>
      {searchBox && <div className="p-1 border-bottom">
        <input type="text" className="form-control form-control-sm" name="searchFilter" placeholder="Search..."
            value={searchFilter} onChange={event => setSearchFilter(event.target.value)} />
      </div>}
      <div className="dropdown-item-list">
        {options.map((opt, index) => {
          if (searchFilter && !(opt[displayField] as string).toLowerCase().includes(searchFilter.toLowerCase())) return null;
          return <div role="button" key={opt[valueField]} className={Rosie.classNames('dropdown-item', itemClass, { active: isSelected(opt) })} style={itemStyle} onClick={() => select(opt)}>
                {props.renderer ? props.renderer(opt[displayField], opt, index) : opt[displayField]}
          </div>
        })}
      </div>
    </div>
  </>
}