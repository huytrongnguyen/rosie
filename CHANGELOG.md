# Changelog

## Next

## 0.5.0
> 2026-09-02

**New Features**

- Rewrite `Dropdown` / `InputDropdown` with no Bootstrap JS and no Popper — open state, outside-click and Escape are handled by the component itself
  - Single select closes on pick; multiple stays open, and the options chosen when the menu opened stay pinned to the top so unticking one does not make it jump
  - `searchable` filter box, `Select all` with an indeterminate mark, collapsible section headers, dividers, custom `renderer` and `triggerRenderer`, `menuAlign`, `disabled`
  - New styles: `.dropdown-btn` (matches `.form-control` sizing, `.dropdown-btn-sm` for the small variant), `.dropdown-placeholder`, `.dropdown-search`, `.dropdown-item-label`, `.dropdown-select-all`, `.dropdown-section`, `.dropdown-empty`
  - The menu anchors to the trigger with `position: fixed`, so it escapes an ancestor's `overflow: hidden`, flips above the trigger when there is more room there, caps its height to the space available, and re-anchors on scroll and resize
  - Only the option list scrolls: `.dropdown-list` caps its own height, so the search box and Select all stay put above it
  - Options come from either `options` or a `store`; both feed the same `records` the menu renders, so a server-loaded list needs no extra wiring. Filtering is in-memory for now

- Add `DatePicker` and `DateRangePicker`, both built on the same anchored panel as `Dropdown`
  - Each date point is either **rolling** (N days ago, so a saved report keeps moving with time) or **exact**; switching between them keeps the day already chosen instead of clearing it
  - Preset column: Today / Yesterday / 7D / 30D for a single date, and Today through Last Month for a range
  - The range picker shows two months side by side, picks start then end, swaps them if chosen in reverse, and previews the span on hover
  - Edits stay in a draft until **Apply**; **Cancel** discards them
- Add `usePopover` — the open state, outside-click and Escape handling, and trigger anchoring shared by `Dropdown` and both pickers
- Rewrite `Dialog` with no Bootstrap JS: it portals into `document.body`, draws its own backdrop, locks body scroll while open, closes on Escape, and restores focus to whatever was focused before. It opens by being rendered and closes through `onClose`, so the caller owns the state
- Add `ConfirmDialog` — title, message, and a confirm button whose `variant` picks the button colour
- Add date helpers to core: `Date.MONTH_NAMES`, `Date.DOW_NAMES`, `Date.daysAgo(value)`, `Date.prototype.startOfWeek(weekStartsOn?)`, and `'week'` as a unit for `plus`/`minus`
- Move the framework-free half of component behaviour into `ts/core/`, so one implementation can serve both React and a plain HTML page
  - `ts/core/behavior/` — `anchorPanel()` and `bindPopover()` (placement with flip, plus the resize, scroll, outside-click and Escape listeners), `onEscape()`, `onOutsideClick()`, and `lockModal()` (body scroll lock and focus restore). Each returns its own release function
  - `anchorPanel()` returns CSS values as strings, so the same placement can be handed to React's `style` prop or assigned onto `element.style`
  - `ts/core/grid/` — `formatCellText()`, `isEmptyValue()`, `EMPTY_CELL_TEXT`, `measureColumnWidth()` and the `ColumnFormat` type, moved out of the React Grid folder. A consumer building their own grid from the `rosie-grid` classes gets the same formatting and content-based auto-size
  - `usePopover` and `Dialog` are now thin adapters over these; nothing about their behaviour changed
- Add `dist/js/rosie.bundle.js` — rosie's behaviour for pages React does not own: static HTML, Razor Pages, any server-rendered page with a `<script>` tag. Built from `ts/core` as one IIFE, it exposes `window.Rosie` and wires itself up from data attributes on load
  - `data-rosie-toggle="collapse"` with `data-rosie-target`, and `data-rosie-parent` for accordion behaviour where opening one closes its siblings
  - `data-rosie-toggle="dropdown"` — anchors the menu with the same `bindPopover` the React `Dropdown` uses, so it escapes `overflow: hidden`, flips when short of room, and closes on outside click, Escape or picking an item. `data-rosie-align="end"` right-aligns it
  - `data-rosie-toggle="tab"` with a `.tab-content` of `.tab-pane` children
  - `data-rosie-toggle="modal"` and `data-rosie-dismiss="modal"` — draws the backdrop, locks body scroll, closes on Escape or a click on the backdrop, and restores focus
  - `data-rosie-dismiss="alert"` / `"toast"` removes the closest one
  - `data-rosie-tooltip="…"` shows a tooltip on hover, positioned by the shared `anchorPanel`
  - A `.rosie-grid` built by hand gets its header scrolled horizontally with its body — the one piece of Grid behaviour that cannot be done in CSS, and the same thing the React `Grid` does with a listener on its body ref
  - Listeners are delegated on `document`, so markup added after load needs no re-initialising. `Rosie.initPlugins()` is idempotent if you do need to call it
  - Grid, DatePicker and DateRangePicker are deliberately not in it — they are data-driven. What ships for them is the CSS and the framework-free functions, so a page can build its own
- Add the `.flex-1` utility (`flex: 1 1 0%`, responsive), for grid columns that should share the width equally. `.flex-fill` stays `flex: 1 1 auto`, which sizes from content
- Add the small size to components that only had a default: `.card-sm`, `.nav-sm`, `.accordion-sm`, `.badge-sm`, `.progress-sm`, `.list-group-sm`, `.alert-sm`, `.rosie-callout-sm`, `.rosie-widget-sm`, `.rosie-grid-sm`, `.rosie-date-picker-sm`, `.dropdown-menu-sm`. Each one only overrides that component's own `--rosie-*` tokens, so nothing is restyled and a nested part picks the size up by inheritance

**Improvements**

- Rebuild `kitchen-sink.html` as a documentation page: every example now shows its markup underneath the preview, so a class name can be copied without reading the file
  - New **Theme viewer** section, laid out panel by panel after the ExtJS theme viewer so the same widget set can be compared. Each panel is assembled from what already ships — card plus collapse, an overlay of utilities for a load mask, buttons and a dropdown for a toolbar, flex utilities for a border layout, nav-tabs above a card, form controls for the grid and paging toolbars — all at the small size so a whole screen fits in one panel
  - The sidebar groups the 27 sections into Overview · Foundations · Forms · Components · Extended · Utilities
  - The page now loads `rosie.bundle.js`, so the examples work rather than only being described: dropdowns open and anchor, the accordion closes its siblings, tabs switch panes, the modal opens with a backdrop, an alert dismisses, and a tooltip follows the cursor's trigger. The markup blocks are still written into the file, not generated at runtime
- `kitchen-sink.html` gains the extended dropdown trigger and menu
- The theme viewer's Grid panel now holds 13 rows in a fixed-height grid, so the body scrolls under a header that stays put — the behaviour the div-based grid exists for, which three rows could not show
  - Every column in it carries an explicit width, and it has nine of them, so the row is wider than the panel and scrolls horizontally too. A grid that needs horizontal scroll cannot use flexible columns — `.flex-1` gives a column a share of the container, so the row can never overflow it. The two modes are exclusive: flexible columns for a grid that fits its container, fixed widths for one that scrolls

**Bug Fixes**

- Escape every inline SVG data URI in `_variables.scss` through a new `escape-svg()`. A data URI stops at a raw `#`, so an interpolated colour truncated the SVG and the image never loaded — this silently broke the close button, checkbox and radio ticks, the switch knob, select and accordion carets, validation icons and the navbar toggler
- Apply the button-group sizes through the `button-size()` mixin instead of `@extend`. `.btn-group-sm > .btn` extended `.btn-sm`, which lives in another module — `@extend` cannot reach across a `@use` boundary, so the selector never made it into the compiled CSS and grouped buttons stayed at the default size. `.btn-group-lg` had the same fault
- Build the navbar container with `make-container()` for the same reason: `.navbar-expand-* > .container*` extended `.container` from another module, so those rules were missing from the compiled CSS entirely

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