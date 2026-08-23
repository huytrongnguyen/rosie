import { useContext, useEffect, useState } from 'react';
import { History, RouterLocation, navigate } from './history';
import { RouteContext } from './context';
import { PathParams, matchPattern } from './path';

export function useLocation(): RouterLocation {
  const [location, setLocation] = useState(History.value);

  useEffect(() => {
    const subscription = History.subscribe(setLocation);
    return () => subscription.unsubscribe();
  }, []);

  return location;
}

export function useNavigate() { return navigate }

export function useParams<T extends PathParams = PathParams>() {
  return useContext(RouteContext).params as T;
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string>, options?: { replace?: boolean }) => void] {
  const { pathname, search } = useLocation();

  const setSearchParams = (next: URLSearchParams | Record<string, string>, options?: { replace?: boolean }) => {
    const params = next instanceof URLSearchParams ? next : new URLSearchParams(next),
          query = params.toString();
    navigate(query ? `${pathname}?${query}` : pathname, options);
  };

  return [new URLSearchParams(search), setSearchParams];
}

export function useMatch(pattern: string) {
  return matchPattern(pattern, useLocation().pathname);
}
