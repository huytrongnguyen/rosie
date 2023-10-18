export interface Dictionary<T> {
  [index: string]: T;
}

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export type HttpParams = {
  pathParams?: Dictionary<any>,
  queryParams?: Dictionary<any>,
  body?: any,
  headers?: Dictionary<any>,
}

export type AjaxSettings = {
  url: string,
  method?: HttpMethod,
  params?: HttpParams,
}