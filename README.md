# Rosie UI

Rosie UI is a JavaScript library that build on top of [React 19.1](https://react.dev/) and [Bootstrap 5.3](https://getbootstrap.com), helping you build data-intensive, cross-platform web apps for desktops, tablets, and smartphones.

## Getting Started

- Create a project folder and set up npm
- Install `esbuild`, `sass`
- Install `rosie-ui`, `react`, `react-dom`
- Install additional dependencies

### Project Structure

```
your-project/
├── node_modules/
│   ├── bootstrap
│   │   └── dist
│   │       └── js
│   │           └── bootstrap.bundle.min.js
│   └── rosie-ui
│       ├── dist
│       │   ├── css
│       │   ├── js
│       │   └── webfonts
│       └── scss
│           └── _variables.scss
├── dist/
│   ├── app.css
│   ├── app.js
│   └── index.html
├── src/
│   ├── app
│   │   ├── views
│   │   │   ├── _app.view.scss
│   │   │   └── app.view.tsx
│   │   ├── app.scss
│   │   └── app.tsx
├── package.json
└── tsconfig.json
```

#### `index.html`

```html
<!doctype html>
<html lang="en">
<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hello, world!</title>
  <link rel="stylesheet" href="app.css" />
</head>
<body>
  <div id="react-root"></div>
  <script src="app.js"></script>
</body>
</html>
```

#### `app.scss`

```scss
@forward '../../node_modules/rosie-ui/dist/css/rosie.css';

@forward 'views/app.view';
```

#### `app.tsx`

While the Bootstrap CSS can be used with any framework, the Bootstrap JavaScript is not fully compatible with JavaScript frameworks like React, Vue, and Angular which assume full knowledge of the DOM. Both Bootstrap and the framework may attempt to mutate the same DOM element, resulting in bugs like dropdowns that are stuck in the “open” position.

```tsx
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { createRoot } from 'react-dom/client';

import { AppView } from './views/app.view';

createRoot(document.getElementById('react-root') as HTMLElement).render(<AppView />);
```

#### `scripts` in `package.json`

```json
{
  // ...
  "scripts": {
    "start": "esbuild src/app/app.tsx --bundle --outfile=dist/app.js --loader:.tsx=tsx --format=iife --watch",
    "build": "npm run build-css && npm run build-js",
    "build-css": "sass src/app/app.scss disc/app.css --style=compressed --no-source-map",
    "build-js": "esbuild src/app/app.tsx --bundle --outfile=dist/app.js --loader:.tsx=tsx --format=iife",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

## License

`Rosie UI` is released under the MIT license.