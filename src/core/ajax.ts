import { AjaxSettings } from './types';

export const Ajax = {
  request: async <T = any>(settings: AjaxSettings): Promise<T> => {
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

    let res: Response = null;
    try {
      res = await fetch(url, config);
      return res.json() as T;
    } catch {
      return res.text as T;
    }
  },
}