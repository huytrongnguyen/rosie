import { Modal } from 'bootstrap';
import { Dictionary } from '../core/types';

export const isString = (value: any) => typeof value === 'string';
export const isNumber = (value: any) => typeof value === 'number';
export const isBoolean = (value: any) => typeof value === 'boolean';
export const isObject = (value: any) => toString.call(value) === '[object Object]';
export const isArray = (value: any) => toString.call(value) === '[object Array]';
export const isDate = (value: any) => toString.call(value) === '[object Date]' && !isNaN(value);
export const isEmpty = (value: any) => value === undefined || value == null || value === '' || (isArray(value) && value.length === 0) || (isObject(value) && Object.keys(value).length === 0);
export const isNotEmpty = (value: any) => !isEmpty(value);

export const guid = (prefix: string = '', suffix: string = '') => `${prefix}${(Math.random() * (1<<30)).toString(16).replace('.', '')}${suffix}`;

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