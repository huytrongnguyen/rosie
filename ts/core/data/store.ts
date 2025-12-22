import { HttpParams, AjaxError } from '../ajax';
import { Subject } from '../observable';
import { ProxyConfig, ajaxRequest } from './proxy';
import { DataModel } from './model';

export class DataStore<T = any> extends Subject<DataModel<T>[]> {
  constructor(public config?: ProxyConfig) { super(); }

  loadData(data: T[]) { data && super.next(data.map(DataModel.create)); }

  load(params?: HttpParams, onError?: (_reason: AjaxError) => T[], onComplete?: () => void) {
    this.fetch(params, onError, onComplete).then((value: T[]) => value && this.loadData(value));
  }

  fetch(params?: HttpParams, onError?: (_reason: AjaxError) => T[], onComplete?: () => void) {
    return ajaxRequest<T[]>(this.config, params).catch(onError).finally(onComplete);
  }
}