import { Subject } from '../../core/observable';

export type RouterMode = 'history' | 'hash';

export type RouterLocation = {
  pathname: string,
  search: string,
  hash: string,
}

export type NavigateOptions = { replace?: boolean, state?: any };

const PUSH_STATE_UNSUPPORTED_PROTOCOL = 'file:';
const PATH_ONLY_BASE = 'http://rosie.invalid';

function supportsPushState() {
  return window.location.protocol !== PUSH_STATE_UNSUPPORTED_PROTOCOL;
}

let mode: RouterMode = supportsPushState() ? 'history' : 'hash';

export function routerMode() { return mode }

export function configureRouter(options: { mode: RouterMode }) {
  mode = options.mode;
  History.next(readLocation());
}

function splitPath(path: string): RouterLocation {
  const { pathname, search, hash } = new URL(path || '/', PATH_ONLY_BASE);
  return { pathname, search, hash };
}

function toPath({ pathname, search, hash }: RouterLocation) {
  return `${pathname}${search}${hash}`;
}

function readLocation(): RouterLocation {
  if (mode === 'hash') return splitPath(window.location.hash.slice(1));

  const { pathname, search, hash } = window.location;
  return { pathname, search, hash };
}

export function hrefFor(to: string) {
  const path = toPath(splitPath(to));
  return mode === 'hash' ? `#${path}` : path;
}

export const History = new Subject<RouterLocation>();
History.value = readLocation();

window.addEventListener('popstate', () => History.next(readLocation()));
window.addEventListener('hashchange', () => History.next(readLocation()));

export function navigate(to: string | number, options: NavigateOptions = {}) {
  if (typeof to === 'number') return window.history.go(to);

  const path = toPath(splitPath(to));

  if (mode === 'hash') return navigateByHash(path, options);

  if (path === toPath(readLocation()) && !options.replace) return;

  window.history[options.replace ? 'replaceState' : 'pushState'](options.state ?? null, '', path);
  History.next(readLocation());
}

function navigateByHash(path: string, options: NavigateOptions) {
  if (window.location.hash.slice(1) === path) return;

  if (options.replace) window.location.replace(`#${path}`);
  else window.location.hash = path;
}
