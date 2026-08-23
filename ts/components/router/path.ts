export type PathParams = { [key: string]: string };

const STATIC_SEGMENT_SCORE = 10;
const PARAM_SEGMENT_SCORE = 3;
const SPLAT_SEGMENT_SCORE = -2;

export function normalizePath(path: string) {
  const cleaned = `/${path}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  return cleaned || '/';
}

export function joinPaths(...parts: (string | undefined)[]) {
  return normalizePath(parts.filter(Boolean).join('/'));
}

export function scorePattern(pattern: string) {
  return segmentsOf(pattern).reduce((score, segment) => score + scoreSegment(segment), 0);
}

function scoreSegment(segment: string) {
  if (segment === '*') return SPLAT_SEGMENT_SCORE;
  return segment.startsWith(':') ? PARAM_SEGMENT_SCORE : STATIC_SEGMENT_SCORE;
}

export function matchPattern(pattern: string, pathname: string): PathParams | null {
  const patternSegments = segmentsOf(pattern),
        pathSegments = segmentsOf(pathname),
        params: PathParams = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const segment = patternSegments[i];

    if (segment === '*') {
      params['*'] = pathSegments.slice(i).join('/');
      return params;
    }

    const value = pathSegments[i];
    if (value === undefined) return null;

    if (segment.startsWith(':')) params[segment.slice(1)] = decodeURIComponent(value);
    else if (segment !== value) return null;
  }

  return patternSegments.length === pathSegments.length ? params : null;
}

function segmentsOf(path: string) {
  return normalizePath(path).split('/').filter(Boolean);
}
