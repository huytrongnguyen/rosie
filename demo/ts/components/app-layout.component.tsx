import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'rosie-ui';
import { NAVIGATION } from '../data/navigation';
import { AppSidebar } from './app-sidebar.component';

export function AppLayout() {
  const { pathname } = useLocation(),
        current = NAVIGATION.find(entry => entry.path === pathname),
        [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false) }, [pathname]);

  return <div className="demo-app">
    <AppSidebar open={menuOpen} />
    {menuOpen && <button type="button" className="demo-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

    <div className="demo-main">
      <header className="demo-topbar">
        <button type="button" className="demo-menu-toggle" aria-label="Menu" aria-expanded={menuOpen}
                onClick={() => setMenuOpen(!menuOpen)}>
          <i className="rosie-icon rosie-icon-bars" />
        </button>

        <nav aria-label="Breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Rosie Console</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{current?.title ?? 'Not found'}</li>
          </ol>
        </nav>
      </header>

      <main className="demo-view"><Outlet /></main>
    </div>
  </div>
}
