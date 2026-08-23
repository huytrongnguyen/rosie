# Changelog

## Next

## 0.4.2
> 2026-08-23

**New Features**

- Add `Router`: `Routes`, `Route`, `Outlet`, `Link`, `NavLink`, `Navigate`, and the `useLocation`, `useNavigate`, `useParams`, `useSearchParams`, `useMatch` hooks
  - Two URL modes — `history` for apps behind a server, `hash` for a static HTML page opened over `file://`, where `pushState` is not permitted
  - Detected from the document protocol; override with `configureRouter({ mode })`
- Add icons as CSS: `<i class="rosie-icon rosie-icon-chart-bar">`, drawn on a 24×24 grid and emitted as a mask, so a glyph takes its colour from `currentColor` and its size from `font-size`. 68 glyphs, plus `.rosie-icon-spin`
  - No font file, no sprite and no JavaScript, so icons work in a plain HTML page
- Add `demo/` — a sample single-page app built on the package (`npm run demo`), alongside `kitchen-sink.html`
- Add `Grid` — a div-based data grid bound to a `DataStore`, with columns declared as `<GridColumn>` children
  - Column config: `field`, `header`, `headerRenderer`, `headerTooltip`, `width`, `flex`, `alignClass`, `format`, `renderer`
  - Columns without an explicit `width` are sized from their own content and clamped to 100–400px, so a grid whose shape is only known at runtime still lines up
  - `format` accepts `integer`, `decimal`, `percent` (a 0–1 ratio) and `number`; an empty value renders as `—` so it reads apart from a blank string
  - The header sits outside the scrolling area and follows the body's horizontal scroll, so only the body scrolls
  - Loading skeleton and empty state
  - Sorting, resizing, column pinning, tree rows, paging and selection are present in the types but not implemented yet
- Add `Number.prototype.format(fractionDigits?)` — thousands separators, with a fixed number of decimals when given

**Improvements**

- `kitchen-sink.html` gains an Icons section

## 0.4.1
> 2026-08-01

- Expose `Ajax`, `Observable`, `DataModel`, `DataStore`

## 0.4.0
> 2026-07-11

Rebuilt Rosie UI around a `--rosie-*` token-based design system with Bootstrap-compatible class names, with zero Bootstrap dependencies. This release ships **styles + core scripts only** — React components are being reworked and will return in a later version.

**New Features**

- Token-based SCSS design system (primitive → semantic `--rosie-*` tiers), light theme, primary `#e97b98`
- Subpath exports: `rosie-ui/css`, `rosie-ui/scss`, `rosie-ui/scss/*`

**Breaking Changes**

- ESM-only package (`"type": "module"`)
- Removed the React component API from the published package (`Grid`, `Dialog`, `DatePicker`, `Dropdown`, …) — temporarily; only styles + the `Rosie` core namespace (lang extensions, utilities, types) ship now
- Removed runtime dependencies: `bootstrap`, `@popperjs/core`, `axios`
- Removed `FontAwesome` from styles

## 0.3.0
> 2026-02-12

**New Features**

- Add new components:
  - `PagingToolbar`
  - `DatePicker`, `DateRangePicker`
  - `QueryOperation`
- Load data to `Grid` via `store` property

**Bug Fixes**

- Correct `rosie-grid` css

**Breaking Changes**

- Upgrade to React 19.2.4

## 0.2.0
> 2025-08-28

**Breaking Changes**

- Upgrade to React 19.1

## 0.1.9
> 2024-05-30

- Correct type in `groupBy` extension method

## 0.1.8
> 2024-05-28

**New Features**

- Add `useSubject` custom hook

**Improvements**

- #10 Should configure css class: rosie-grid-bordered rosie-grid-striped rosie-grid-hover
- #18 `Subject` enhancement
- #14 `DataModel` enhancement
- #16 `Grid` enhancement
- Add array extension method: `groupBy`, `sumBy`, `toDictionary`

## 0.1.6
> 2024-04-29

- New Features
  - #6 Add `DataModel`, `DataStore` object
- Improvements
  - #9 Supports to select row by checkbox
  - Restructure `ts`
  - Refine `scss`
- Bug Fixes
  - #13 `GridCell` not update value when `DataModel` change

## 0.1.3
> 2024-01-13

- New Features
  - #2 Add Observable object
  - Add `TextField` component
- Improvements
  - Change to use `axios` for AJAX instead of `fetch`

## 0.0.4
> 2023-11-12

- #1 TypeError: Failed to execute 'text' on 'Response': body stream already read

## 0.0.3
> 2023-10-30

- Should declare `react`, `react-dom` in `peerDependencies`
- Separate `components`
- Correct build command

## 0.0.2
> 2023-10-27

- Restructure codebase, separate script and style

## 0.0.1
> 2023-10-17

- Initial project