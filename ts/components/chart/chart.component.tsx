import { PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import {
  DataModel, LEGEND_POSITION, Rosie, SceneNode, TOOLTIP_TRIGGER, TooltipModel, buildScene, interpolateScene,
  pointItemRows, radialItemRows,
} from '../../core';
import { SceneElement } from './scene-element.component';
import { ChartLegend } from './chart-legend.component';
import { ChartTooltip } from './chart-tooltip.component';
import { ChartProps } from './types';

const ANIMATION_DURATION_MS = 500;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export function Chart({ store, className, loading, empty, ...config }: Readonly<ChartProps>) {
  const [records, setRecords] = useState<DataModel<any>[]>([]),
        [size, setSize] = useState({ width: 0, height: 0 }),
        [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set()),
        [highlightedKey, setHighlightedKey] = useState<string | null>(null),
        [renderedNodes, setRenderedNodes] = useState<SceneNode[]>([]),
        [tooltip, setTooltip] = useState<TooltipModel | null>(null),
        // The plot only mounts once records arrive, so a useRef set on that render never
        // triggers the observer effect again — state as the ref target re-fires it on mount.
        [box, setBox] = useState<HTMLDivElement | null>(null),
        committedRef = useRef<SceneNode[]>([]);

  const scene = buildScene(config, records, size, { hiddenKeys, highlightedKey });

  useEffect(() => {
    const subscription = store.subscribe(value => setRecords(value ?? []));
    return () => subscription.unsubscribe();
  }, [store]);

  useEffect(() => {
    if (!box) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });

    observer.observe(box);
    return () => observer.disconnect();
  }, [box]);

  useEffect(() => {
    if (!size.width || !size.height) return;

    if (prefersReducedMotion()) {
      setRenderedNodes(scene.nodes);
      committedRef.current = scene.nodes;
      return;
    }

    const from = committedRef.current,
          start = performance.now();
    let raf = 0;

    function tick(now: number) {
      const eased = easeOutCubic(Math.min(1, (now - start) / ANIMATION_DURATION_MS));
      setRenderedNodes(interpolateScene(from, scene.nodes, eased));

      if (eased < 1) raf = requestAnimationFrame(tick);
      else committedRef.current = scene.nodes;
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [records, size.width, size.height, hiddenKeys, highlightedKey]);

  function toggleSeries(key: string) {
    setHiddenKeys(previous => {
      const next = new Set(previous);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function moveOverChart(event: ReactPointerEvent<SVGSVGElement>) {
    if (!scene.showTooltip || scene.tooltipTrigger !== TOOLTIP_TRIGGER.axis) return;

    const rect = box?.getBoundingClientRect();
    if (rect) setTooltip(scene.hitTest(event.clientX - rect.left, event.clientY - rect.top));
  }

  function leaveChart() {
    if (scene.tooltipTrigger === TOOLTIP_TRIGGER.axis) setTooltip(null);
  }

  function enterItem(node: SceneNode, event: ReactPointerEvent) {
    if (!scene.showTooltip || scene.tooltipTrigger !== TOOLTIP_TRIGGER.item || !node.datum) return;

    const rect = box?.getBoundingClientRect();
    if (!rect) return;

    const { label, rows } = scene.isRadial ? radialItemRows(node.datum) : pointItemRows(node.datum, config);
    setTooltip({ x: event.clientX - rect.left, y: event.clientY - rect.top, label, rows });
  }

  function leaveItem() {
    if (scene.tooltipTrigger === TOOLTIP_TRIGGER.item) setTooltip(null);
  }

  const hairline = tooltip && scene.tooltipTrigger === TOOLTIP_TRIGGER.axis ? scene.horizontal
    ? { x1: scene.margin.left, x2: scene.margin.left + scene.plotWidth, y1: tooltip.y, y2: tooltip.y }
    : { x1: tooltip.x, x2: tooltip.x, y1: scene.margin.top, y2: scene.margin.top + scene.plotHeight }
    : null;

  const legendPosition = (config.legend && config.legend.position) || LEGEND_POSITION.bottom;

  const legend = scene.showLegend && <ChartLegend items={scene.legend} hiddenKeys={hiddenKeys} highlightedKey={highlightedKey}
                                                  onToggle={toggleSeries} onHighlight={setHighlightedKey} />;

  return <div className={Rosie.classNames('rosie-chart', `rosie-chart-legend-${legendPosition}`, className)}>
    {loading && <div className="rosie-chart-plot rosie-chart-loading"><div className="rosie-skeleton rosie-skeleton-card" /></div>}

    {!loading && !records.length && <div className="rosie-chart-plot rosie-empty-state">
      <div className="rosie-empty-state-title">{empty?.title ?? 'No data'}</div>
      {empty?.desc && <div className="rosie-empty-state-description">{empty.desc}</div>}
    </div>}

    {!loading && !!records.length && <>
      {legendPosition === LEGEND_POSITION.top && legend}

      <div ref={setBox} className="rosie-chart-plot">
        <svg role="img" aria-label={scene.ariaLabel} width={size.width} height={size.height}
             className="rosie-chart-svg" onPointerMove={moveOverChart} onPointerLeave={leaveChart}>
          {renderedNodes.map(node => <SceneElement key={node.key} node={node} onPointerEnter={enterItem} onPointerLeave={leaveItem} />)}
          {hairline && <line className="rosie-chart-hairline" {...hairline} />}
        </svg>

        {tooltip && <ChartTooltip tooltip={tooltip} boxWidth={size.width} boxHeight={size.height} />}
      </div>

      {legendPosition !== LEGEND_POSITION.top && legend}
    </>}
  </div>
}
