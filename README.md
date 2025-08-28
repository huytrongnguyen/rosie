# Rosie UI

Rosie UI is a JavaScript library that build on top of [React 19.1](https://react.dev/) and [Bootstrap 5.3](https://getbootstrap.com), helping you build data-intensive, cross-platform web apps for desktops, tablets, and smartphones.

## Getting Started

### File Structure

```
your-project/
├── node_modules/
│   ├── rosie-ui
│   │   ├── dist
│   │   │   ├── css
│   │   │   ├── js
│   │   │   ├── webfonts
│   │   ├── scss
├── src/
│   ├── app
│   │   ├── components
│   │   │   ├── _app.component.scss
│   │   │   ├── app.component.tsx
│   │   ├── app.html
│   │   ├── app.scss
│   │   ├── app.tsx
├── package.json
├── tsconfig.json
```

#### `app.html`

```html
<!doctype html>
<html lang="en">
<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Hello, world!</title>

  <link rel="stylesheet" href="app.scss" />
</head>
<body>
  <div id="react-root"></div>
  <script src="app.tsx"></script>
</body>
</html>
```

#### `app.scss`

```scss
@import '../../node_modules/rosie-ui/dist/css/rosie.css';

@import 'components/app.component';
```

#### `app.tsx`

```tsx
import { createRoot } from 'react-dom/client';

import { AppComponent } from './components/app.component';

createRoot(document.getElementById('react-root') as HTMLElement).render(<AppComponent />);
```

## Customize

```scss
// app.scss
// Option 1: Include all of Rosie UI

@import '../../node_modules/rosie-ui/dist/css/rosie.css';

// Then add additional custom code here
```

```scss
// app.scss
// Option 2: Include parts of Rosie UI

// 1. Include functions first (so you can manipulate colors, SVGs, calc, etc)
@import '../../../node_modules/bootstrap/scss/functions';

// 2. Include any default variable overrides here
// @import '../../../node_modules/rosie-ui/scss/variables';

// 3. Include remainder of required Bootstrap stylesheets

@import '../../../node_modules/bootstrap/scss/bootstrap';

// 5. Include remainder of required parts
@import '../../../node_modules/rosie-ui/scss/mixin';
@import '../../../node_modules/rosie-ui/scss/reset';
@import '../../../node_modules/rosie-ui/scss/utilities';

$fa-font-path: '../../../node_modules/@fortawesome/fontawesome-free/webfonts';

@import '../../../node_modules/@fortawesome/fontawesome-free/scss/fontawesome';
@import '../../../node_modules/@fortawesome/fontawesome-free/scss/solid';

// Then add additional custom code here
```

## License

`Rosie UI` is released under the MIT license.