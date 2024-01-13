import { AxiosError, Method } from 'axios';

export type HttpMethod = Method;
export type AjaxError = AxiosError;

export interface Dictionary<T> {
  [index: string]: T;
}

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