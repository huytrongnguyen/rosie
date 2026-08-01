import { HttpParams, AjaxError } from '../ajax';
import { Subject } from '../observable';
import { ProxyConfig, ajaxRequest } from './proxy';

export class DataModel<T> extends Subject<T> {
  constructor(public config?: ProxyConfig) { super(); }
  selected: boolean = false;

  get<TField = any>(fieldName: string) { return this.value?.[fieldName as keyof T] as TField; }
  loadData(data: T) { data && super.next(data); return this; }
  select() { this.selected = true; this.refresh(); }
  unselect() { this.selected = false; this.refresh(); }
  toggle() { this.selected = !this.selected; this.refresh(); }

  load(params?: HttpParams, onError?: (_reason: AjaxError) => T | null | void, onComplete?: () => void) {
    this.fetch(params, onError, onComplete).then(value => value && this.loadData(value));
  }

  fetch(params?: HttpParams, onError?: (_reason: AjaxError) => T | null | void, onComplete?: () => void): Promise<T | null> {
    return ajaxRequest<T>(this.config, params)
      .catch(err => {
        if (!onError) throw err;
        const r = onError(err);
        return (r ?? null) as T | null;
      })
      .finally(onComplete);
  }

  static create<T = any>(data: T) {
    const record = new DataModel<T>();
    record.loadData(data);
    return record;
  }
}
