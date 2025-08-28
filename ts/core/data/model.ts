import { HttpParams, AjaxError } from '../ajax';
import { Subject } from '../observable';
import { ProxyConfig, ajaxRequest } from './proxy';

export class DataModel<T> extends Subject<T> {
  constructor(public config?: ProxyConfig) { super(); }

  get<TField = any>(fieldName: string) { return this.value?.[fieldName as keyof T] as TField; }

  loadData(data: T) { data && super.next(data); return this; }

  load(params?: HttpParams, onError?: (_reason: AjaxError) => T, onComplete?: () => void) {
    this.fetch(params, onError, onComplete).then(value => value && this.loadData(value));
  }

  fetch(params?: HttpParams, onError?: (_reason: AjaxError) => T, onComplete?: () => void) {
    return ajaxRequest<T>(this.config, params).catch(onError).finally(onComplete);
  }

  // static create<T = any>(data: T) {
  //   const record = new DataModel<T>();
  //   record.loadData(data);
  //   return record;
  // }
}
