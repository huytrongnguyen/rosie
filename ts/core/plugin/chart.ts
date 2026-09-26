import { DataModel } from '../data';
import { classNames } from '../mixins';
import {
  ChartConfig, ChartScene, LEGEND_POSITION, LegendItem, TOOLTIP_TRIGGER, TooltipModel, buildScene,
  chartColorClass, interpolateScene, isLineKey, pointItemRows, positionTooltip, radialItemRows, SceneAttrs, SceneNode,
} from '../chart';

const SVG_NS = 'http://www.w3.org/2000/svg';
const CHART_SELECTOR = '[data-rosie-chart]';
const ANIMATION_DURATION_MS = 500;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export type ChartPageConfig = ChartConfig & {
  data: any[],
  className?: string,
  loading?: boolean,
  empty?: { title?: string, desc?: string },
}

export type ChartInstance = {
  update: (config: ChartPageConfig) => void,
  destroy: () => void,
}

const instances = new WeakMap<HTMLElement, ChartInstance>();

export function chart(el: HTMLElement, config: ChartPageConfig): ChartInstance {
  const existing = instances.get(el);
  if (existing) { existing.update(config); return existing; }

  const instance = createChartInstance(el);
  instance.update(config);
  instances.set(el, instance);
  return instance;
}

function createChartInstance(root: HTMLElement): ChartInstance {
  let config: ChartPageConfig = { xField: '', series: [], data: [] },
      records: DataModel<any>[] = [],
      size = { width: 0, height: 0 },
      hiddenKeys = new Set<string>(),
      highlightedKey: string | null = null,
      committed: SceneNode[] = [],
      raf = 0;

  const legendButtons = new Map<string, HTMLButtonElement>();

  const plot = document.createElement('div');
  plot.className = 'rosie-chart-plot';
  root.append(plot);

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('role', 'img');
  svg.classList.add('rosie-chart-svg');
  svg.addEventListener('pointermove', moveOverChart);
  svg.addEventListener('pointerleave', leaveChart);
  svg.addEventListener('pointerover', enterMark);
  svg.addEventListener('pointerout', leaveMark);

  const legend = document.createElement('div');
  legend.className = 'rosie-chart-legend';

  const tooltip = document.createElement('div');
  tooltip.className = 'rosie-chart-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;

  const hairline = document.createElementNS(SVG_NS, 'line');
  hairline.setAttribute('class', 'rosie-chart-hairline');
  hairline.style.display = 'none';

  const observer = new ResizeObserver(entries => {
    const entry = entries[0];
    if (!entry) return;
    size = { width: entry.contentRect.width, height: entry.contentRect.height };
    render();
  });
  observer.observe(plot);

  function scene(): ChartScene {
    return buildScene(config, records, size, { hiddenKeys, highlightedKey });
  }

  function moveOverChart(event: PointerEvent) {
    const current = scene();
    if (!current.showTooltip || current.tooltipTrigger !== TOOLTIP_TRIGGER.axis) return;

    const rect = plot.getBoundingClientRect();
    showTooltip(current.tooltipTrigger, current.hitTest(event.clientX - rect.left, event.clientY - rect.top));
  }

  function leaveChart() {
    if (scene().tooltipTrigger === TOOLTIP_TRIGGER.axis) showTooltip(TOOLTIP_TRIGGER.axis, null);
  }

  function enterMark(event: PointerEvent) {
    const current = scene(),
          mark = (event.target as Element).closest<HTMLElement>('.rosie-chart-mark');

    if (!current.showTooltip || current.tooltipTrigger !== TOOLTIP_TRIGGER.item || !mark) return;

    const datum = (mark as any).rosieDatum,
          rect = plot.getBoundingClientRect(),
          { label, rows } = current.isRadial ? radialItemRows(datum) : pointItemRows(datum, config);

    showTooltip(TOOLTIP_TRIGGER.item, { x: event.clientX - rect.left, y: event.clientY - rect.top, label, rows });
  }

  function leaveMark() {
    if (scene().tooltipTrigger === TOOLTIP_TRIGGER.item) showTooltip(TOOLTIP_TRIGGER.item, null);
  }

  function showTooltip(trigger: string, model: TooltipModel | null) {
    if (trigger === TOOLTIP_TRIGGER.axis) updateHairline(model);

    if (!model) { tooltip.hidden = true; return; }

    const rect = plot.getBoundingClientRect(),
          { left, top } = positionTooltip(model.x, model.y, tooltip.offsetWidth || 200, tooltip.offsetHeight || 60, rect.width, rect.height);

    tooltip.innerHTML = '';
    tooltip.hidden = false;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;

    const labelEl = document.createElement('div');
    labelEl.className = 'rosie-chart-tooltip-label';
    labelEl.textContent = model.label;
    tooltip.append(labelEl);

    model.rows.forEach(row => {
      const rowEl = document.createElement('div');
      rowEl.className = 'rosie-chart-tooltip-row';

      const swatch = document.createElement('span');
      swatch.className = classNames('rosie-chart-tooltip-swatch', chartColorClass(row.colorIndex),
        { 'rosie-chart-tooltip-swatch-line': isLineKey(row.type) });

      const value = document.createElement('span');
      value.className = 'rosie-chart-tooltip-value';
      value.textContent = row.value;

      const title = document.createElement('span');
      title.className = 'rosie-chart-tooltip-title';
      title.textContent = row.title;

      rowEl.append(swatch, value, title);
      tooltip.append(rowEl);
    });
  }

  function toggleSeries(key: string) {
    hiddenKeys.has(key) ? hiddenKeys.delete(key) : hiddenKeys.add(key);
    render();
  }

  function highlightSeries(key: string | null) {
    highlightedKey = key;
    render();
  }

  // Rebuilding every button on each render would drop the one under the pointer mid-gesture —
  // a real click is a mousedown/mouseup pair, and the hover that precedes it already re-renders
  // (to show the highlight), so a fresh element at mouseup never receives the click. Buttons are
  // created once per key and only have their class/aria-pressed updated after that.
  function renderLegend(items: LegendItem[]) {
    const currentKeys = new Set(items.map(item => item.key));

    legendButtons.forEach((button, key) => {
      if (currentKeys.has(key)) return;
      button.remove();
      legendButtons.delete(key);
    });

    items.forEach(item => {
      const active = !hiddenKeys.has(item.key);
      let button = legendButtons.get(item.key);

      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.addEventListener('click', () => toggleSeries(item.key));
        button.addEventListener('pointerenter', () => highlightSeries(item.key));
        button.addEventListener('pointerleave', () => highlightSeries(null));

        const swatch = document.createElement('span');
        swatch.className = classNames('rosie-chart-legend-swatch', { 'rosie-chart-legend-swatch-line': isLineKey(item.type) });
        button.append(swatch, document.createTextNode(item.title));

        legendButtons.set(item.key, button);
        legend.append(button);
      }

      button.setAttribute('aria-pressed', String(active));
      button.className = classNames('rosie-chart-legend-item', chartColorClass(item.colorIndex),
        { 'is-hidden': !active, 'is-active': highlightedKey === item.key });
    });
  }

  // Moving the legend only when its position actually changed keeps a hover-triggered render from
  // detaching a button mid gesture — a real click is mousedown then mouseup, and a plain re-append
  // on every render (even one that only updates a highlight) breaks that pairing.
  function placeLegend(position: string) {
    if (position === LEGEND_POSITION.top) {
      if (root.firstElementChild !== legend) root.prepend(legend);
    } else if (root.lastElementChild !== legend) {
      root.append(legend);
    }
  }

  function renderPlot(current: ChartScene) {
    if (config.loading) {
      plot.className = 'rosie-chart-plot rosie-chart-loading';
      plot.innerHTML = '<div class="rosie-skeleton rosie-skeleton-card"></div>';
      return;
    }

    if (!records.length) {
      plot.className = 'rosie-chart-plot rosie-empty-state';
      plot.innerHTML = '';

      const title = document.createElement('div');
      title.className = 'rosie-empty-state-title';
      title.textContent = config.empty?.title ?? 'No data';
      plot.append(title);

      if (config.empty?.desc) {
        const desc = document.createElement('div');
        desc.className = 'rosie-empty-state-description';
        desc.textContent = config.empty.desc;
        plot.append(desc);
      }
      return;
    }

    plot.className = 'rosie-chart-plot';
    plot.innerHTML = '';
    svg.setAttribute('aria-label', current.ariaLabel);
    svg.setAttribute('width', String(size.width));
    svg.setAttribute('height', String(size.height));
    plot.append(svg, tooltip);
  }

  function render() {
    cancelAnimationFrame(raf);

    const current = scene();
    renderPlot(current);

    const legendPosition = (config.legend && config.legend.position) || LEGEND_POSITION.bottom;
    root.className = classNames('rosie-chart', config.className, `rosie-chart-legend-${legendPosition}`);

    if (!current.showLegend) {
      if (legend.parentElement) legend.remove();
    } else {
      renderLegend(current.legend);
      placeLegend(legendPosition);
    }

    if (config.loading || !records.length || !size.width || !size.height) {
      drawSvg(current.nodes);
      committed = current.nodes;
      return;
    }

    if (prefersReducedMotion()) {
      drawSvg(current.nodes);
      committed = current.nodes;
      return;
    }

    const from = committed,
          start = performance.now();

    const tick = (now: number) => {
      const eased = easeOutCubic(Math.min(1, (now - start) / ANIMATION_DURATION_MS));
      drawSvg(interpolateScene(from, current.nodes, eased));

      if (eased < 1) raf = requestAnimationFrame(tick);
      else committed = current.nodes;
    };

    raf = requestAnimationFrame(tick);
  }

  function drawSvg(nodes: SceneNode[]) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    nodes.forEach(node => svg.append(renderNode(node)));
    svg.append(hairline);
  }

  function updateHairline(model: TooltipModel | null) {
    if (!model) { hairline.style.display = 'none'; return; }

    const current = scene();
    hairline.style.display = '';

    if (current.horizontal) {
      hairline.setAttribute('x1', String(current.margin.left));
      hairline.setAttribute('x2', String(current.margin.left + current.plotWidth));
      hairline.setAttribute('y1', String(model.y));
      hairline.setAttribute('y2', String(model.y));
    } else {
      hairline.setAttribute('x1', String(model.x));
      hairline.setAttribute('x2', String(model.x));
      hairline.setAttribute('y1', String(current.margin.top));
      hairline.setAttribute('y2', String(current.margin.top + current.plotHeight));
    }
  }

  return {
    update(nextConfig: ChartPageConfig) {
      config = nextConfig;
      records = (config.data ?? []).map(DataModel.create);
      render();
    },
    destroy() {
      cancelAnimationFrame(raf);
      observer.disconnect();
      root.innerHTML = '';
      root.className = '';
    },
  };
}

function renderNode(node: SceneNode): Element {
  const el = document.createElementNS(SVG_NS, node.tag);

  if (node.className) el.setAttribute('class', node.className);
  if (node.style) Object.entries(node.style).forEach(([name, value]) => el.style.setProperty(name, value));
  setAttrs(el, node.attrs);
  if (node.text !== undefined) el.textContent = node.text;

  if (node.datum) {
    el.classList.add('rosie-chart-mark');
    (el as any).rosieDatum = node.datum;
  }

  node.children?.forEach(child => el.append(renderNode(child)));
  return el;
}

function setAttrs(el: Element, attrs: SceneAttrs) {
  Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, String(value)));
}

export function initChart() {
  document.querySelectorAll<HTMLElement>(CHART_SELECTOR).forEach(el => {
    if (instances.has(el)) return;

    const configEl = el.querySelector('script[type="application/json"]');
    if (!configEl?.textContent) return;

    try {
      chart(el, JSON.parse(configEl.textContent));
    } catch {
      return;
    }
  });
}
