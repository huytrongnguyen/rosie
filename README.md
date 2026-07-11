# Rosie UI

Rosie UI is a pastel, token-based design system for building data-intensive, cross-platform web apps for desktops, tablets, and smartphones.

It ships as an ESM package that works out of the box with every modern bundler (Vite, webpack, esbuild, Rollup, Parcel). This release exposes the **styles** and a small set of **core scripts**; React components are in progress and will land in a later version.

- Bootstrap-compatible class names — existing Bootstrap markup migrates with no class changes.
- A `--rosie-*` CSS custom-property token system (primitive → semantic tiers), light theme, primary `#e97b98`.
- No runtime dependency on Bootstrap.

## Install

```bash
npm install rosie-ui
```

React `19.2.4` is a peer dependency (pinned exactly — each React version is treated as distinct):

```bash
npm install react@19.2.4 react-dom@19.2.4
```

## Usage

### Styles

Import the compiled CSS once at your app entry:

```ts
import 'rosie-ui/css';
```

Or compile the SCSS yourself and override tokens:

```scss
@use 'rosie-ui/scss' with (
  $primary: #e97b98
);
```

Then use the Bootstrap-compatible class names in your markup:

```html
<button class="btn btn-primary">Save</button>
<div class="card"><div class="card-body">…</div></div>
```

See `kitchen-sink.html` for every component rendered.

### Core scripts

The `Rosie` namespace bundles the core utilities and language extensions:

```ts
import { Rosie } from 'rosie-ui';
```

## Subpath exports

| Import | What |
| --- | --- |
| `rosie-ui` | Core scripts (ESM) + types |
| `rosie-ui/css` | Compiled stylesheet |
| `rosie-ui/scss` | SCSS entry (for token overrides) |
| `rosie-ui/scss/*` | Individual SCSS partials |

## Development

```bash
npm install
npm run build      # css + js
npm run css        # styles only → dist/css/rosie.css
npm run js         # scripts only → dist/js (tsc)
```

## License

`Rosie UI` is released under the MIT license.
