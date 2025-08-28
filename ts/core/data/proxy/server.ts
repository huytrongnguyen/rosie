import { Ajax, HttpMethod, HttpParams } from '../../ajax';

export type ProxyConfig = {
  proxy: { url: string, method?: HttpMethod }
}

export async function ajaxRequest<T = any>(config?: ProxyConfig, params?: HttpParams): Promise<T> {
  const { proxy } = config ?? {} as ProxyConfig,
        { url, method } = proxy;

  let response = await Ajax.request<any>({ url, method, params });

  return response;
}