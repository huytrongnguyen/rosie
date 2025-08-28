export interface Dictionary<T> {
  [index: string]: T;
}

export type NavItem = {
  navId: string,
  navName: string,
  navIcon?: string,
  navPath?: string,
  children?: NavItem[],
}