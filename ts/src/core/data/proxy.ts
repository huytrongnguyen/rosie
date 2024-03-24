import { HttpMethod, HttpParams } from '../types';
import { Ajax } from '../ajax';

export type ProxyConfig = {
  proxy: { url: string, method?: HttpMethod, }
}

// export class ProxyConfig<T> {
//   proxy?: { url: string, method?: HttpMethod, reader?: ReaderConfig<T> }
// }

// export type ReaderConfig<T> = {
//   // rootProperty?: string,
//   // totalProperty?: string,
//   // successProperty?: string,
//   // messageProperty?: string,
//   // summaryProperty?: string,
//   // rawData?: any,
//   // keepRawData?: boolean,
//   // transform?: (rawData: any) => T,
// }

export async function ajaxRequest<T = any>(config?: ProxyConfig, params?: HttpParams): Promise<T> {
  const { proxy } = config ?? {} as ProxyConfig,
        { url, method } = proxy;

  let response = await Ajax.request<any>({ url, method, params });

//   if (reader && reader.transform) {
//     response = reader.transform(response);
//   }

//   if (reader && reader.rootProperty) {
//     response = response[reader.rootProperty];
//   }

  return response;
}