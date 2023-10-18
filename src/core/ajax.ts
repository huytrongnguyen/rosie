import { AjaxSettings } from './types';

export const Ajax = {
  request: async <T = any>(settings: AjaxSettings) => {
    const { method = 'get', params = {} } = settings;
    let { url } = settings;

    if (params.pathParams) {
      Object.entries(params.pathParams).forEach(([key,value]) => url = url.replace(`{${key}}`, value))
    }

    if (params.queryParams) {
      url = `${url}?${Object.entries(params.queryParams).filter(([_key,value]) => !!value).map(([key,value]) => `${key}=${value}`).join('&')}`
    }

    const config: RequestInit = { method, headers: [['Accept', 'application/json'],['Content-Type', 'application/json; charset=utf-8']] }
    params.body && (config.body = JSON.stringify(params.body));

    const res = await fetch(url, config);
    return res.json() as T;
  },
}