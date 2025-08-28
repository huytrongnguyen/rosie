import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { Dictionary } from './types';

export type HttpMethod = Method;

export interface AjaxError extends AxiosError<any> { }

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

export const Ajax = {
  request: async <T>(settings: AjaxSettings) => {
    const { method = 'get', params = {} } = settings;
    let { url } = settings;

    if (params.pathParams) {
      Object.entries(params.pathParams).forEach(([key,value]) => url = url.replace(`{${key}}`, value))
    }

    if (params.queryParams) {
      url = `${url}?${Object.entries(params.queryParams).map(([key,value]) => `${key}=${value}`).join('&')}`
    }

    const config: AxiosRequestConfig = {
      url, method,
      headers: params.headers || {},
      timeout: 0,
    };
    params.body && (config.data = params.body);

    return (await axios(config)).data as T;
  },
}