import $ from 'jquery/dist/jquery.slim';
import { Modal } from 'bootstrap';
import toastr from 'toastr';
import { format as d3Format } from 'd3';

import { Dictionary } from './core/types';

//region ===== Configuration =====
toastr.options.closeButton = true;
toastr.options.preventDuplicates = true;
toastr.options.positionClass = 'toast-bottom-right';
toastr.options.timeOut = 5000;
//endregion

export const isString = (value: any) => typeof value === 'string';
export const isNumber = (value: any) => typeof value === 'number';
export const isBoolean = (value: any) => typeof value === 'boolean';
export const isObject = (value: any) => toString.call(value) === '[object Object]';
export const isArray = (value: any) => toString.call(value) === '[object Array]';
export const isDate = (value: any) => toString.call(value) === '[object Date]' && !isNaN(value);
export const isEmpty = (value: any) => value === undefined || value == null || value === '' || (isString(value) && value.trim() === '') || (isArray(value) && value.length === 0) || (isObject(value) && Object.keys(value).length === 0);
export const isNotEmpty = (value: any) => !isEmpty(value);

export const guid = (prefix: string = '', suffix: string = '') => `${prefix}${(Math.random() * (1<<30)).toString(16).replace('.', '')}${suffix}`;

export const query = (selectors: any) => $(selectors);
export const beforeProcessing = () => query('#app-splash-screen').show();
export const afterProcessing = () => query('#app-splash-screen').hide();

export const alertInfo = toastr.info;
export const alertSuccess = toastr.success;
export const alertWarning = toastr.warning;
export const alertError = toastr.error;

export function classNames(...expressions: any[]) {
  return expressions
      .filter(exp => isNotEmpty(exp))
      .map(exp => {
        if (isString(exp)) {
          return exp as string;
        } else if (isObject(exp)) {
          return Object.entries(exp as Dictionary<boolean>)
              .filter(([_key, value]) => value === true)
              .map(([key, _value]) => key)
              .join(' ');
        } else {
          return '';
        }
      })
      .filter(className => isNotEmpty(className))
      .join(' ');
}

export function showModal(selector: string, onShow?: () => void, onHide?: () => void) {
  const dialogEl = document.querySelector(selector);
  onShow && dialogEl?.addEventListener('shown.bs.modal', onShow);
  onHide && dialogEl?.addEventListener('hide.bs.modal', onHide);
  new Modal(selector).show();
}

export function hideModal(selector: string, onHide?: () => void) {
  const dialogEl = document.querySelector(selector);
  onHide && dialogEl?.addEventListener('hide.bs.modal', onHide);
  dialogEl && Modal.getInstance(dialogEl)?.hide();
}

export const SCROLLBAR_WIDTH = getScrollWidth();
function getScrollWidth() {
  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
}

export function exportToCsv(fileName: string, data: any[], headers?: Dictionary<string>, delimiter = ',', lineDelimiter = '\r\n') {
  if (!data) return;

  if (!headers) {
    headers = Object.keys(data[0]).groupBy(x => x, g => g.first()) as Dictionary<string>;
  }

  const columnNames = Object.keys(headers as any),
        header = `${columnNames.map(name => `"${headers?.[name]}"`).join(delimiter)}${lineDelimiter}`,
        content = data.map(row => columnNames.map(name => `"${row[name] ?? ''}"`).join(delimiter)),
        csvContent = header + content.join(lineDelimiter);

    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(new Blob([csvContent],{type: 'text/csv;charset=utf-8;'})));
    link.setAttribute('download', fileName || 'export.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
}

export const Number = {
  // https://github.com/d3/d3-format#locale_format
  // [​[fill]align][sign][symbol][0][width][,][.precision][~][type]
  pattern: (specifier: string = ',.2~f') => d3Format(specifier),
  format: (value: number | { valueOf(): number } = 0, pattern: string = ',.2~f') => d3Format(pattern)(value ?? 0),
}