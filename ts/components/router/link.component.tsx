import { AnchorHTMLAttributes, MouseEvent, ReactNode, useEffect } from 'react';
import { hrefFor, navigate, NavigateOptions } from './history';
import { useLocation } from './hooks';
import { normalizePath } from './path';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string,
  replace?: boolean,
  children?: ReactNode,
}

function opensOutsideThisDocument(event: MouseEvent<HTMLAnchorElement>, target?: string) {
  return event.defaultPrevented
      || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || !!target;
}

export function Link({ to, replace, onClick, ...rest }: Readonly<LinkProps>) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (opensOutsideThisDocument(event, rest.target)) return;

    event.preventDefault();
    navigate(to, { replace });
  };

  return <a href={hrefFor(to)} onClick={handleClick} {...rest} />
}

export type NavLinkProps = LinkProps & {
  activeClassName?: string,
  end?: boolean,
}

export function NavLink({ activeClassName = 'active', end, className = '', ...rest }: Readonly<NavLinkProps>) {
  const { pathname } = useLocation(),
        target = normalizePath(rest.to),
        current = normalizePath(pathname),
        active = end ? current === target : current === target || current.startsWith(`${target}/`);

  return <Link {...rest} className={active ? `${className} ${activeClassName}`.trim() : className} aria-current={active ? 'page' : undefined} />
}

export function Navigate({ to, replace = true, state }: Readonly<{ to: string } & NavigateOptions>): null {
  useEffect(() => { navigate(to, { replace, state }) }, [to, replace]);
  return null;
}
