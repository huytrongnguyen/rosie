import { NavLink } from 'rosie-ui';
import { NAVIGATION } from '../data/navigation';

export function AppSidebar({ open }: Readonly<{ open: boolean }>) {
  return <nav className={`demo-sidebar ${open ? 'is-open' : ''}`}>
    <div className="demo-brand">
      <i className="rosie-icon rosie-icon-chart-pie" />
      <span>Rosie Console<small>Rosie UI demo</small></span>
    </div>

    {NAVIGATION.map(entry =>
      <NavLink key={entry.path} to={entry.path} end={entry.path === '/'} className="demo-nav-link">
        <i className={`rosie-icon rosie-icon-${entry.icon}`} />
        {entry.label}
      </NavLink>
    )}
  </nav>
}
