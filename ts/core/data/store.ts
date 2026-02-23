import { HttpParams, AjaxError } from '../ajax';
import { Subject } from '../observable';
import { ProxyConfig, ajaxRequest } from './proxy';
import { DataModel } from './model';

export class DataStore<T = any> extends Subject<DataModel<T>[]> {
  constructor(public config?: ProxyConfig) { super(); }

  loadData(data: T[]) { data && super.next(data.map(DataModel.create)); }
  add(item: T) { this.addRecord(DataModel.create(item)); }
  addRecord(record: DataModel<T>) { this.next([...(this.value ?? []), record]); }
  insertRecord(record: DataModel<T>) { this.next([record, ...(this.value ?? [])]); }

  load(params?: HttpParams, onError?: (_reason: AjaxError) => T[], onComplete?: () => void) {
    this.fetch(params, onError, onComplete).then((value: T[]) => value && this.loadData(value));
  }

  fetch(params?: HttpParams, onError?: (_reason: AjaxError) => T[], onComplete?: () => void) {
    return ajaxRequest<T[]>(this.config, params).catch(onError).finally(onComplete);
  }
}