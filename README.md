# Rosie UI

Rosie UI is a JavaScript library that build on top of [React 18.2](https://react.dev/) and [Bootstrap 5.3](https://getbootstrap.com), helping you build data-intensive, cross-platform web apps for desktops, tablets, and smartphones.

## Getting Started

### File Structure

```
project/
├── node_modules/
├── src/
│   ├── app
│   │   ├── components
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

## License

`Rosie UI` is released under the MIT license.