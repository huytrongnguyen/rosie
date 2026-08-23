import { Children, isValidElement, ReactNode, useContext } from 'react';
import { RouteConfig, RouteContext } from './context';
import { joinPaths, matchPattern, scorePattern } from './path';
import { useLocation } from './hooks';

export type RouteProps = {
  path?: string,
  index?: boolean,
  element?: ReactNode,
  children?: ReactNode,
}

export function Route(_: RouteProps): any { return null }

export function Routes({ children }: Readonly<{ children: ReactNode }>) {
  const { pathname } = useLocation(),
        branches = toBranches(toConfigs(children)),
        matched = branches.map(branch => ({ branch, params: matchPattern(branch.pattern, pathname) }))
                          .find(candidate => candidate.params);

  if (!matched) return null;

  return <RouteContext.Provider value={{ chain: matched.branch.chain, depth: 0, params: matched.params! }}>
    {renderDepth(matched.branch.chain, 0)}
  </RouteContext.Provider>
}

export function Outlet() {
  const { chain, depth, params } = useContext(RouteContext),
        next = depth + 1;

  if (next >= chain.length) return null;

  return <RouteContext.Provider value={{ chain, depth: next, params }}>
    {renderDepth(chain, next)}
  </RouteContext.Provider>
}

function renderDepth(chain: RouteConfig[], depth: number) {
  return chain[depth].element ?? <Outlet />;
}

function toConfigs(children: ReactNode): RouteConfig[] {
  return Children.toArray(children).filter(isValidElement).map(child => {
    const props = child.props as RouteProps;
    return { path: props.path ?? '', index: props.index, element: props.element, children: toConfigs(props.children) };
  });
}

type Branch = { pattern: string, score: number, chain: RouteConfig[] };

function toBranches(configs: RouteConfig[], parentPath = '', parentChain: RouteConfig[] = []): Branch[] {
  const branches = configs.flatMap(config => {
    const pattern = joinPaths(parentPath, config.path),
          chain = [...parentChain, config];
    return config.children.length
      ? toBranches(config.children, pattern, chain)
      : [{ pattern, score: scorePattern(pattern), chain }];
  });

  return parentChain.length ? branches : branches.sort((a, b) => b.score - a.score);
}
