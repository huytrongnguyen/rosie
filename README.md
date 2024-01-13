# Rosie UI

Rosie UI is a JavaScript library that build on top of [React 18.2](https://react.dev/) and [Bootstrap 5.3](https://getbootstrap.com), helping you build data-intensive, cross-platform web apps for desktops, tablets, and smartphones.

## Getting Started

`app.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MDM Framework</title>
  <link rel="stylesheet" href="app.scss" />
</head>
<body>
  <div id="react-root"></div>
  <script type="module" src="app.tsx"></script>
</body>
</html>
```

`app.scss`

```scss
$fa-font-path: '../../../node_modules/@fortawesome/fontawesome-free/webfonts';

@import '../../rosie/scss/rosie';
@import 'components/app.component';
```

`components/_app.component.scss`

```scss
html, body, main, .app, .app-wrapper, .app-body, .main, .aside-menu, .fullscreen, #react-root { @include fullscreen(); }

.app {
  aside {
    width: 15rem;
    background-color: $body-color;
    color: $body-bg;

    header {
      flex: 0 0 $breadcrumb-height;
      .navbar-brand {
        color: $primary;
        font-size: $font-size-base * 1.5;
      }
    }

    .sidebar-body {
      .nav-link {
        &:hover { background-color: $component-hover-bg; color: $white; }
        &.active { background-color: $primary !important; }
      }
    }
  }
}
```

`app.tsx`

```tsx
import { createRoot } from 'react-dom/client';

import { AppComponent } from './components/app.component';

createRoot(document.getElementById('react-root')).render(<AppComponent />);
```

`components/app.component.tsx`

```tsx
import { BrowserRouter as Router, Link, Navigate, Route, Routes } from 'react-router-dom';
import { HomeComponent } from './home';

export function AppComponent() {
  return <Router>
    <div className="app d-flex flex-row">
      <aside className="app-sidebar d-flex flex-column">
        <header className="d-flex justify-content-center align-items-center border-bottom">
          <Link to="/home" className="navbar-brand mb-0 fw-bold">Rosie UI</Link>
        </header>
        <div className="sidebar-body flex-1 overflow-y-auto">
        </div>
        <footer className="d-flex flex-column border-top">
          <Account />
          <div className="d-flex justify-content-between p-1 border-top">
            <small>&copy; 2024 Rosie</small>
            <small>v0.1.0</small>
          </div>
        </footer>
      </aside>
      <div className="app-wrapper d-flex position-relative">
        <div id="app-splash-screen" className="mask">
          <div className="mask-msg">
            <div className="mask-msg-text">
              <span className="fa fa-circle-notch fa-spin me-1" />
              Loading...
            </div>
          </div>
        </div>
        <div className="app-body d-flex flex-column">
          <Routes>
            <Route path="/home" element={<HomeComponent />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </div>
    </div>
  </Router>
}
```

## License

`Rosie UI` is released under the MIT license.