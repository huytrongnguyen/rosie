import { createContext, ReactNode } from 'react';
import { PathParams } from './path';

export type RouteConfig = {
  path: string,
  index?: boolean,
  element?: ReactNode,
  children: RouteConfig[],
}

export type RouteContextValue = {
  chain: RouteConfig[],
  depth: number,
  params: PathParams,
}

export const RouteContext = createContext<RouteContextValue>({ chain: [], depth: 0, params: {} });
