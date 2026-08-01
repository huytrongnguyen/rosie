import { Dictionary } from './types';

export type HttpMethod = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS';

export class AjaxError extends Error {
  response: { status: number; data: any };
  constructor(status: number, data: any) {
    super(`HTTP ${status}`);
    this.response = { status, data };
  }
}

export type HttpParams = {
  pathParams?: Dictionary<any>,
  queryParams?: Dictionary<any>,
  body?: any,
  headers?: Dictionary<any>,
  signal?: AbortSignal,
}

export type AjaxSettings = {
  url: string,
  method?: HttpMethod,
  params?: HttpParams,
  signal?: AbortSignal,
}

export type RequestInterceptorResult = { init?: RequestInit; url?: string } | undefined;
export type RequestInterceptor = (
  init: RequestInit,
  url: string,
) => RequestInterceptorResult | Promise<RequestInterceptorResult>;

export type ResponseInterceptor = (
  res: Response,
  data: any,
) => any | Promise<any>;

let requestInterceptor:  RequestInterceptor  | null = null;
let responseInterceptor: ResponseInterceptor | null = null;

async function buildRequest(settings: AjaxSettings, defaults: { method: HttpMethod, accept?: string }) {
  const { method = defaults.method, params = {}, signal: callerSignal } = settings;
  let { url } = settings;

  if (params.pathParams) {
    Object.entries(params.pathParams).forEach(([key, value]) => url = url.replace(`{${key}}`, value));
  }

  if (params.queryParams) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params.queryParams)) {
      if (value == null) continue;
      if (Array.isArray(value)) value.forEach(v => v != null && search.append(key, String(v)));
      else search.append(key, String(value));
    }
    const qs = search.toString();
    if (qs) url = `${url}?${qs}`;
  }

  const headers: Record<string, string> = {};
  if (defaults.accept) headers['Accept'] = defaults.accept;
  if (params.headers) {
    Object.entries(params.headers).forEach(([k, v]) => { if (v != null) headers[k] = String(v); });
  }

  let init: RequestInit = { method: method.toUpperCase(), headers };

  if (params.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(params.body);
  }

  if (!!callerSignal) init.signal = callerSignal;

  if (requestInterceptor) {
    const patched = await requestInterceptor(init, url);
    if (patched?.init) init = patched.init;
    if (patched?.url)  url  = patched.url;
  }

  return { url, init };
}

export type SseEvent<T = any> = { event: string, data: T };

export const Ajax = {
  setRequestInterceptor:  (fn: RequestInterceptor  | null) => { requestInterceptor  = fn; },
  setResponseInterceptor: (fn: ResponseInterceptor | null) => { responseInterceptor = fn; },

  request: async <T>(settings: AjaxSettings): Promise<T> => {
    const { url, init } = await buildRequest(settings, { method: 'GET' });

    const res = await fetch(url, init);

    const contentType = res.headers.get('content-type');
    let data = contentType?.includes('application/json') ? await res.json() : await res.text();

    if (responseInterceptor) data = await responseInterceptor(res, data);

    if (!res.ok) throw new AjaxError(res.status, data);

    return data as T;
  },

  stream: async function* <T = any>(settings: AjaxSettings): AsyncGenerator<SseEvent<T>> {
    const { url, init } = await buildRequest(settings, { method: 'POST', accept: 'text/event-stream' });

    const res = await fetch(url, init);
    if (!res.ok) {
      const contentType = res.headers.get('content-type');
      let data = contentType?.includes('application/json') ? await res.json() : await res.text();
      if (responseInterceptor) data = await responseInterceptor(res, data);
      throw new AjaxError(res.status, data);
    }
    if (!res.body) return;

    const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += value;

      let separator: number;
      while ((separator = buffer.indexOf('\n\n')) >= 0) {
        const block = buffer.slice(0, separator);
        buffer = buffer.slice(separator + 2);
        if (!block) continue;

        let event = 'message';
        let dataStr = '';
        for (const line of block.split('\n')) {
          if (line.startsWith('event:')) event = line.slice(line[6] === ' ' ? 7 : 6).trim();
          else if (line.startsWith('data:')) dataStr += line.slice(line[5] === ' ' ? 6 : 5);
        }
        if (!dataStr) continue;
        if (dataStr === '[DONE]') return;
        try {
          yield { event, data: JSON.parse(dataStr) as T };
        } catch {
          continue;
        }
      }
    }
  },
}
