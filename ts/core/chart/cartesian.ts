import { area as d3Area, curveLinear, curveMonotoneX, line as d3Line, stack as d3Stack } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { DataModel } from '../data';
import { classNames } from '../mixins';
import { formatCellText } from '../grid/format';
import {
  AXIS_TYPE, ChartAxis, ChartConfig, ChartInteractionState, ChartSeries, ChartTooltipRow, CHART_TYPE,
  LegendItem, TooltipModel, chartColorClass, seriesKey,
} from './types';
import {
  axisFor, buildCategoryScale, buildLinearScale, buildPaddedScale, buildPointScale, buildSizeScale, buildTimeScale,
  categoryValues, formatTickValue, inferFieldType, isHorizontalOrientation, padDomain, pickTickCount,
  thinHorizontalCategoryLabels, thinPositionedTicks, thinVerticalCategoryLabels,
} from './scale';
import { measureText } from './measure-text';
import { SceneNode, barThickness, colorStyle } from './node';

const AXIS_FONT = '12px sans-serif';
const AXIS_TICK_LENGTH_PX = 4;
const AXIS_LABEL_GAP_PX = 4;
const NUMERIC_TICK_GAP_PX = 40;
const MARKER_RADIUS_PX = 4;
const SCATTER_HIT_RADIUS_PX = 12;
const MIN_BUBBLE_RADIUS_PX = 4;
const MAX_BUBBLE_RADIUS_RATIO = 0.07;
const MAX_BUBBLE_RADIUS_CAP_PX = 20;

export type ChartMargin = { top: number, right: number, bottom: number, left: number };

export type CartesianScene = {
  nodes: SceneNode[],
  legend: LegendItem[],
  ariaLabel: string,
  margin: ChartMargin,
  plotWidth: number,
  plotHeight: number,
  horizontal: boolean,
  hitTest: (pointerX: number, pointerY: number) => TooltipModel | null,
}

type VisibleSeries = { series: ChartSeries, index: number };

export function buildCartesianScene(config: ChartConfig, records: DataModel<any>[], size: { width: number, height: number }, state: ChartInteractionState): CartesianScene {
  const horizontal = isHorizontalOrientation(config.axes),
        xType = inferFieldType(records, config.xField),
        categoryLabels = xType === AXIS_TYPE.category ? categoryValues(records, config.xField) : [],
        legend = buildLegend(config.series),
        visible: VisibleSeries[] = config.series
          .map((series, index) => ({ series, index }))
          .filter(({ series, index }) => !state.hiddenKeys.has(seriesKey(series, index)));

  const pointOnly = isPointOnlyChart(visible.map(v => v.series));

  const valueAxis = axisFor(config.axes, horizontal ? 'bottom' : 'left'),
        categoryAxis = axisFor(config.axes, horizontal ? 'left' : 'bottom'),
        rawValueDomain = pointOnly ? computePointValueDomain(records, visible.map(v => v.series)) : computeValueDomain(records, visible.map(v => v.series)),
        marginValueDomain = pointOnly ? padDomain(rawValueDomain[0], rawValueDomain[1]) : rawValueDomain,
        margin = computeMargin(horizontal, marginValueDomain, valueAxis, categoryAxis, categoryLabels, size);

  const innerWidth = Math.max(0, size.width - margin.left - margin.right),
        innerHeight = Math.max(0, size.height - margin.top - margin.bottom);

  const categoryRange: [number, number] = horizontal ? [0, innerHeight] : [0, innerWidth],
        valueRange: [number, number] = horizontal ? [0, innerWidth] : [innerHeight, 0];

  const hasBarSeries = config.series.some(s => s.type === CHART_TYPE.bar),
        valueTickCount = pickTickCount(horizontal ? innerWidth : innerHeight, NUMERIC_TICK_GAP_PX),
        categoryTickCount = pickTickCount(horizontal ? innerHeight : innerWidth, NUMERIC_TICK_GAP_PX);

  const xScale: any = xType === AXIS_TYPE.time ? buildTimeScale(records, config.xField, categoryRange)
      : xType === AXIS_TYPE.category ? (hasBarSeries ? buildCategoryScale(categoryLabels, categoryRange) : buildPointScale(categoryLabels, categoryRange))
      : buildNumericXScale(records, config.xField, categoryRange, pointOnly, categoryTickCount);

  const yScale: any = pointOnly
      ? buildPaddedScale(rawValueDomain[0], rawValueDomain[1], valueRange, valueTickCount)
      : buildLinearScale(rawValueDomain[0], rawValueDomain[1], valueRange, valueTickCount);

  const pairsBySeries = computeStacks(records, visible.map(v => v.series));

  const axisNodes = [
    ...buildGrid(yScale, horizontal, innerWidth, innerHeight, valueTickCount),
    ...buildValueAxis(yScale, valueAxis, horizontal, innerWidth, innerHeight, valueTickCount),
    ...buildCategoryAxis(xScale, xType, categoryLabels, horizontal, innerWidth, innerHeight, margin, categoryTickCount),
  ];

  const context: SeriesContext = { config, records, xScale, yScale, xType, horizontal, pairsBySeries };
  const seriesNodes = buildSeriesNodes(context, visible, state, innerWidth, innerHeight);

  return {
    nodes: [{ key: 'plot', tag: 'g', attrs: { transform: `translate(${margin.left},${margin.top})` }, children: [...axisNodes, ...seriesNodes] }],
    legend,
    ariaLabel: `${config.series.map(s => s.title ?? s.field).join(', ')} by ${config.xField}`,
    margin,
    plotWidth: innerWidth,
    plotHeight: innerHeight,
    horizontal,
    hitTest: (pointerX, pointerY) => hitTest(context, margin, innerWidth, innerHeight, categoryLabels, visible.map(v => v.series), pointerX, pointerY),
  };
}

type SeriesContext = {
  config: ChartConfig,
  records: DataModel<any>[],
  xScale: any,
  yScale: any,
  xType: string,
  horizontal: boolean,
  pairsBySeries: Map<string, [number, number][]>,
}

function buildLegend(series: ChartSeries[]): LegendItem[] {
  return series.map((s, index) => ({ key: seriesKey(s, index), title: s.title ?? s.field, colorIndex: index, type: s.type }));
}

function computeValueDomain(records: DataModel<any>[], series: ChartSeries[]): [number, number] {
  let min = 0, max = 0;
  const stackTotals = new Map<string, number[]>();

  records.forEach((record, recordIndex) => {
    series.forEach(s => {
      const value = record.get(s.field) ?? 0;
      if (s.stack) {
        const totals = stackTotals.get(s.stack) ?? records.map(() => 0);
        totals[recordIndex] += value;
        stackTotals.set(s.stack, totals);
      } else {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    });
  });

  stackTotals.forEach(totals => totals.forEach(total => { min = Math.min(min, total); max = Math.max(max, total); }));
  if (min === 0 && max === 0) max = 1;
  return [min, max];
}

function isPointOnlyChart(series: ChartSeries[]): boolean {
  return series.length > 0 && series.every(s => s.type === CHART_TYPE.scatter || s.type === CHART_TYPE.bubble);
}

function computePointValueDomain(records: DataModel<any>[], series: ChartSeries[]): [number, number] {
  const values = records.flatMap(record => series.map(s => record.get(s.field) ?? 0));
  return [Math.min(...values), Math.max(...values)];
}

function buildNumericXScale(records: DataModel<any>[], xField: string, range: [number, number], pointOnly: boolean, tickCount: number) {
  const values = records.map(record => record.get(xField)),
        min = Math.min(...values), max = Math.max(...values);

  return pointOnly ? buildPaddedScale(min, max, range, tickCount) : buildLinearScale(min, max, range, tickCount);
}

function computeStacks(records: DataModel<any>[], series: ChartSeries[]) {
  const groups = new Map<string, ChartSeries[]>();
  series.forEach(s => { if (s.stack) groups.set(s.stack, [...(groups.get(s.stack) ?? []), s]); });

  const result = new Map<string, [number, number][]>();
  groups.forEach((groupSeries, stackName) => {
    const fields = groupSeries.map(s => s.field),
          layers = d3Stack<DataModel<any>, string>().keys(fields).value((record, field) => record.get(field) ?? 0)(records);

    layers.forEach((layer, layerIndex) => result.set(`${stackName}:${fields[layerIndex]}`, layer.map(pair => [pair[0], pair[1]])));
  });

  return result;
}

function niceTicks(domain: [number, number], count: number) {
  return scaleLinear().domain(domain).nice().ticks(count);
}

function computeMargin(horizontal: boolean, valueDomain: [number, number], valueAxis: ChartAxis | undefined, categoryAxis: ChartAxis | undefined, categoryLabels: string[], size: { width: number, height: number }): ChartMargin {
  const valueAxisLength = horizontal ? size.width : size.height,
        valueTicks = niceTicks(valueDomain, pickTickCount(valueAxisLength, NUMERIC_TICK_GAP_PX)),
        valueLabelSize = Math.max(...valueTicks.map(t => measureText(formatTickValue(t, valueAxis?.format), AXIS_FONT)), 24),
        axisLineSpace = AXIS_TICK_LENGTH_PX + AXIS_LABEL_GAP_PX,
        categoryLabelLineHeight = 16;

  if (horizontal) {
    const categoryLabelWidth = Math.max(...categoryLabels.map(l => measureText(l, AXIS_FONT)), 24);
    return {
      top: 16,
      right: 16,
      bottom: axisLineSpace + categoryLabelLineHeight + (valueAxis?.title ? 20 : 0),
      left: Math.min(160, axisLineSpace + categoryLabelWidth) + (categoryAxis?.title ? 20 : 0),
    };
  }

  return {
    top: 16,
    right: 16,
    bottom: axisLineSpace + categoryLabelLineHeight + (categoryAxis?.title ? 20 : 0),
    left: axisLineSpace + valueLabelSize + (valueAxis?.title ? 20 : 0),
  };
}

function buildGrid(yScale: any, horizontal: boolean, innerWidth: number, innerHeight: number, tickCount: number): SceneNode[] {
  const ticks = yScale.ticks(tickCount);

  return ticks.map((tick: number, index: number) => horizontal
    ? { key: `grid-${index}`, tag: 'line', className: 'rosie-chart-grid-line',
        attrs: { x1: yScale(tick), x2: yScale(tick), y1: 0, y2: innerHeight } }
    : { key: `grid-${index}`, tag: 'line', className: 'rosie-chart-grid-line',
        attrs: { x1: 0, x2: innerWidth, y1: yScale(tick), y2: yScale(tick) } });
}

function buildValueAxis(yScale: any, valueAxis: ChartAxis | undefined, horizontal: boolean, innerWidth: number, innerHeight: number, tickCount: number): SceneNode[] {
  const ticks = yScale.ticks(tickCount);

  return ticks.map((tick: number, index: number) => horizontal
    ? { key: `value-tick-${index}`, tag: 'text', className: 'rosie-chart-axis-label',
        attrs: { x: yScale(tick), y: innerHeight + AXIS_TICK_LENGTH_PX + AXIS_LABEL_GAP_PX + 8, 'text-anchor': 'middle' },
        text: formatTickValue(tick, valueAxis?.format) }
    : { key: `value-tick-${index}`, tag: 'text', className: 'rosie-chart-axis-label',
        attrs: { x: -AXIS_TICK_LENGTH_PX - AXIS_LABEL_GAP_PX, y: yScale(tick), 'text-anchor': 'end', 'dominant-baseline': 'middle' },
        text: formatTickValue(tick, valueAxis?.format) });
}

function buildCategoryAxis(xScale: any, xType: string, categoryLabels: string[], horizontal: boolean, innerWidth: number, innerHeight: number, margin: ChartMargin, tickCount: number): SceneNode[] {
  if (xType === AXIS_TYPE.category) {
    const slotSize = xScale.step(),
          rowLabelWidth = margin.left - AXIS_TICK_LENGTH_PX - AXIS_LABEL_GAP_PX,
          thinned = horizontal
            ? thinVerticalCategoryLabels(categoryLabels, slotSize, rowLabelWidth, AXIS_FONT)
            : thinHorizontalCategoryLabels(categoryLabels, slotSize, AXIS_FONT);

    return thinned.map(({ value, label }, index) => {
      const center = xScale(value) + xScale.bandwidth() / 2;
      return horizontal
        ? { key: `cat-tick-${index}`, tag: 'text', className: 'rosie-chart-axis-label',
            attrs: { x: -AXIS_TICK_LENGTH_PX - AXIS_LABEL_GAP_PX, y: center, 'text-anchor': 'end', 'dominant-baseline': 'middle' }, text: label }
        : { key: `cat-tick-${index}`, tag: 'text', className: 'rosie-chart-axis-label',
            attrs: { x: center, y: innerHeight + AXIS_TICK_LENGTH_PX + AXIS_LABEL_GAP_PX + 8, 'text-anchor': 'middle' }, text: label };
    });
  }

  const rawTicks = xScale.ticks(tickCount),
        positioned = thinPositionedTicks(rawTicks.map((tick: any) => ({
          tick, position: xScale(tick), label: xType === AXIS_TYPE.time ? tick.format('MM/dd') : formatTickValue(tick),
        })), AXIS_FONT);

  return positioned.map(({ position, label }, index) => horizontal
    ? { key: `cat-tick-${index}`, tag: 'text', className: 'rosie-chart-axis-label',
        attrs: { x: -AXIS_TICK_LENGTH_PX - AXIS_LABEL_GAP_PX, y: position, 'text-anchor': 'end', 'dominant-baseline': 'middle' }, text: label }
    : { key: `cat-tick-${index}`, tag: 'text', className: 'rosie-chart-axis-label',
        attrs: { x: position, y: innerHeight + AXIS_TICK_LENGTH_PX + AXIS_LABEL_GAP_PX + 8, 'text-anchor': 'middle' }, text: label });
}

function recordX(xScale: any, xType: string, xField: string, record: DataModel<any>): number {
  const raw = record.get(xField);
  if (xType === AXIS_TYPE.category) return xScale(String(raw)) + xScale.bandwidth() / 2;
  if (xType === AXIS_TYPE.time) return xScale(new Date(raw));
  return xScale(raw);
}

const BAR_BAND_FILL_RATIO = 0.7;

// A band scale carries its own width; a time or numeric x has none, so a bar needs one estimated
// from the tightest gap between two records — otherwise every bar collapses to zero thickness.
function estimateBandwidth(xScale: any, xType: string, xField: string, records: DataModel<any>[]): number {
  if (xType === AXIS_TYPE.category) return xScale.bandwidth();

  const positions = Array.from(new Set(records.map(record => recordX(xScale, xType, xField, record)))).sort((a, b) => a - b);
  if (positions.length < 2) return 24;

  let minGap = Infinity;
  for (let i = 1; i < positions.length; i++) minGap = Math.min(minGap, positions[i] - positions[i - 1]);
  return minGap * BAR_BAND_FILL_RATIO;
}

function buildSeriesNodes(context: SeriesContext, visible: VisibleSeries[], state: ChartInteractionState, innerWidth: number, innerHeight: number): SceneNode[] {
  const { config, records, xScale, yScale, xType, horizontal, pairsBySeries } = context,
        barVisible = visible.filter(v => v.series.type === CHART_TYPE.bar),
        otherVisible = visible.filter(v => v.series.type !== CHART_TYPE.bar),
        slots = groupBarSlots(barVisible);

  const bandwidth = estimateBandwidth(xScale, xType, config.xField, records);

  const barNodes = slots.map((slot, slotIndex) => {
    const thickness = barThickness(bandwidth, slots.length),
          slotOffset = (slotIndex - (slots.length - 1) / 2) * (thickness + 2);

    return buildBarSlotNode(slot, slotIndex, context, thickness, slotOffset, state);
  });

  const otherNodes = otherVisible.map(({ series, index }) => {
    const key = seriesKey(series, index),
          colorClass = chartColorClass(index),
          dimmed = !!state.highlightedKey && state.highlightedKey !== key,
          className = classNames('rosie-chart-series', colorClass, { 'is-dimmed': dimmed }),
          style = colorStyle(series.color),
          pairs = series.stack ? pairsBySeries.get(`${series.stack}:${series.field}`) : undefined;

    if (series.type === CHART_TYPE.scatter || series.type === CHART_TYPE.bubble) {
      return buildPointNode(key, className, style, series, records, xScale, yScale, xType, config.xField, series.type === CHART_TYPE.bubble, innerWidth, innerHeight);
    }

    return buildShapeNode(key, className, style, series, records, xScale, yScale, xType, config.xField, series.type === CHART_TYPE.area, pairs);
  });

  return [...barNodes, ...otherNodes];
}

function groupBarSlots(barVisible: VisibleSeries[]): VisibleSeries[][] {
  const stackGroups = new Map<string, VisibleSeries[]>(),
        slots: VisibleSeries[][] = [];

  barVisible.forEach(v => {
    if (v.series.stack) stackGroups.set(v.series.stack, [...(stackGroups.get(v.series.stack) ?? []), v]);
    else slots.push([v]);
  });

  stackGroups.forEach(list => slots.push(list));
  return slots;
}

function buildBarSlotNode(slot: VisibleSeries[], slotIndex: number, context: SeriesContext, thickness: number, slotOffset: number, state: ChartInteractionState): SceneNode {
  const { records, xScale, yScale, xType, horizontal, config, pairsBySeries } = context;

  const segments = slot.flatMap(({ series, index }) => {
    const key = seriesKey(series, index),
          colorClass = chartColorClass(index),
          dimmed = !!state.highlightedKey && state.highlightedKey !== key,
          className = classNames('rosie-chart-bar', colorClass, { 'is-dimmed': dimmed }),
          style = colorStyle(series.color),
          pairs = series.stack ? pairsBySeries.get(`${series.stack}:${series.field}`) : undefined;

    return records.map((record, i) => {
      const center = recordX(xScale, xType, config.xField, record) + slotOffset,
            [from, to] = pairs ? pairs[i] : [0, record.get(series.field) ?? 0],
            barKey = `${key}-${i}`;

      if (horizontal) {
        const x0 = yScale(from), x1 = yScale(to),
              y = center - thickness / 2,
              x = Math.min(x0, x1),
              width = Math.abs(x1 - x0);

        return {
          key: barKey, tag: 'rect', className, style, datum: { series, record },
          attrs: { x, y, width, height: thickness },
          enter: { x, width: 0 },
          exit: { x, width: 0 },
        } as SceneNode;
      }

      const y0 = yScale(from), y1 = yScale(to),
            x = center - thickness / 2,
            y = Math.min(y0, y1),
            height = Math.abs(y0 - y1);

      return {
        key: barKey, tag: 'rect', className, style, datum: { series, record },
        attrs: { x, y, width: thickness, height },
        enter: { y, height: 0 },
        exit: { y, height: 0 },
      } as SceneNode;
    });
  });

  return { key: `bar-slot-${slotIndex}`, tag: 'g', attrs: {}, children: segments };
}

function buildShapeNode(key: string, className: string, style: Record<string, string> | undefined, series: ChartSeries, records: DataModel<any>[], xScale: any, yScale: any, xType: string, xField: string, filled: boolean, pairs?: [number, number][]): SceneNode {
  const curve = series.smooth ? curveMonotoneX : curveLinear,
        xs = records.map(record => recordX(xScale, xType, xField, record)),
        values = records.map((record, i) => pairs ? pairs[i][1] : (record.get(series.field) ?? 0)),
        base = records.map((_, i) => pairs ? pairs[i][0] : 0),
        points: [number, number][] = xs.map((x, i) => [x, yScale(values[i])]),
        basePoints: [number, number][] = xs.map((x, i) => [x, yScale(base[i])]);

  const lineGen = d3Line<[number, number]>().curve(curve).x(p => p[0]).y(p => p[1]),
        flatLine = d3Line<[number, number]>().curve(curve).x((_, i) => points[i][0]).y((_, i) => basePoints[i][1]),
        lineNode: SceneNode = {
          key: `${key}-line`, tag: 'path', className: 'rosie-chart-line', style,
          attrs: { d: lineGen(points) ?? '' },
          enter: { d: flatLine(points) ?? '' },
          exit: { d: flatLine(points) ?? '' },
        };

  if (!filled) return { key, tag: 'g', attrs: {}, className, style, datum: { series }, children: [lineNode] };

  const areaGen = d3Area<[number, number]>().curve(curve).x((_, i) => xs[i]).y0((_, i) => basePoints[i][1]).y1((_, i) => points[i][1]),
        flatArea = d3Area<[number, number]>().curve(curve).x((_, i) => xs[i]).y0((_, i) => basePoints[i][1]).y1((_, i) => basePoints[i][1]),
        areaNode: SceneNode = {
          key: `${key}-area`, tag: 'path', className: 'rosie-chart-area', style,
          attrs: { d: areaGen(points) ?? '' },
          enter: { d: flatArea(points) ?? '' },
          exit: { d: flatArea(points) ?? '' },
        };

  return { key, tag: 'g', attrs: {}, className, style, datum: { series }, children: [areaNode, lineNode] };
}

function buildPointNode(key: string, className: string, style: Record<string, string> | undefined, series: ChartSeries, records: DataModel<any>[], xScale: any, yScale: any, xType: string, xField: string, bubble: boolean, innerWidth: number, innerHeight: number): SceneNode {
  const maxRadius = Math.max(MIN_BUBBLE_RADIUS_PX, Math.min(MAX_BUBBLE_RADIUS_CAP_PX, Math.min(innerWidth, innerHeight) * MAX_BUBBLE_RADIUS_RATIO));

  const sizeValues = bubble && series.sizeField ? records.map(r => r.get(series.sizeField as string) ?? 0) : [],
        sizeScale = bubble ? buildSizeScale(Math.min(0, ...sizeValues), Math.max(1, ...sizeValues), [MARKER_RADIUS_PX, maxRadius]) : undefined,
        markClassName = bubble ? 'rosie-chart-point rosie-chart-point-bubble' : 'rosie-chart-point';

  const children = records.map((record, i) => {
    const x = recordX(xScale, xType, xField, record),
          y = yScale(record.get(series.field) ?? 0),
          r = sizeScale ? sizeScale(record.get(series.sizeField as string) ?? 0) : MARKER_RADIUS_PX,
          hitR = Math.max(r, SCATTER_HIT_RADIUS_PX);

    return {
      key: `${key}-${i}`, tag: 'g', attrs: { transform: `translate(${x},${y})` }, datum: { series, record },
      children: [
        { key: `${key}-${i}-hit`, tag: 'circle', className: 'rosie-chart-hit', attrs: { r: hitR } },
        { key: `${key}-${i}-mark`, tag: 'circle', className: markClassName, style, attrs: { r }, enter: { r: 0 }, exit: { r: 0 } },
      ],
    } as SceneNode;
  });

  return { key, tag: 'g', attrs: {}, className, style, datum: { series }, children };
}

function hitTest(context: SeriesContext, margin: ChartMargin, innerWidth: number, innerHeight: number, categoryLabels: string[], series: ChartSeries[], pointerX: number, pointerY: number): TooltipModel | null {
  const { records, xScale, yScale, xType, horizontal, config } = context,
        plotX = pointerX - margin.left,
        plotY = pointerY - margin.top;

  if (plotX < 0 || plotX > innerWidth || plotY < 0 || plotY > innerHeight) return null;
  if (!records.length) return null;

  const alongAxis = horizontal ? plotY : plotX;

  let nearestIndex = 0, nearestDistance = Infinity;
  records.forEach((record, i) => {
    const position = recordX(xScale, xType, config.xField, record),
          distance = Math.abs(position - alongAxis);
    if (distance < nearestDistance) { nearestDistance = distance; nearestIndex = i; }
  });

  const record = records[nearestIndex],
        position = recordX(xScale, xType, config.xField, record),
        rows: ChartTooltipRow[] = series.map(s => ({
          title: s.title ?? s.field,
          value: formatCellText(record.get(s.field) ?? 0, s.format ?? 'number'),
          colorIndex: config.series.indexOf(s),
          type: s.type,
        }));

  const label = xType === AXIS_TYPE.category ? String(record.get(config.xField))
      : xType === AXIS_TYPE.time ? new Date(record.get(config.xField)).format()
      : String(record.get(config.xField));

  return horizontal
    ? { x: pointerX, y: margin.top + position, label, rows }
    : { x: margin.left + position, y: pointerY, label, rows };
}

export type PointDatum = { series: ChartSeries, record: DataModel<any> }

export function pointItemRows(datum: PointDatum, config: ChartConfig): { label: string, rows: ChartTooltipRow[] } {
  const xValue = datum.record.get(config.xField);

  return {
    label: typeof xValue === 'number' ? formatCellText(xValue, 'number') : String(xValue),
    rows: [{
      title: datum.series.title ?? datum.series.field,
      value: formatCellText(datum.record.get(datum.series.field) ?? 0, datum.series.format ?? 'number'),
      colorIndex: config.series.indexOf(datum.series),
      type: datum.series.type,
    }],
  };
}
