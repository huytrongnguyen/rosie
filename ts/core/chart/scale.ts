import { scaleBand, scaleLinear, scalePoint, scaleSqrt, scaleTime, ScaleBand, ScaleLinear, ScalePoint, ScaleTime } from 'd3-scale';
import { DataModel } from '../data';
import { ColumnFormat, formatCellText } from '../grid/format';
import { AXIS_TYPE, ChartAxis } from './types';
import { measureText, truncateLabel } from './measure-text';

export type AnyScale = ScaleBand<string> | ScalePoint<string> | ScaleLinear<number, number> | ScaleTime<number, number>;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;

export function inferFieldType(records: DataModel<any>[], field: string): string {
  const sample = records.find(record => record.get(field) !== undefined && record.get(field) !== null)?.get(field);
  if (typeof sample === 'number') return AXIS_TYPE.numeric;
  if (typeof sample === 'string' && ISO_DATE_PATTERN.test(sample)) return AXIS_TYPE.time;
  return AXIS_TYPE.category;
}

export function categoryValues(records: DataModel<any>[], field: string): string[] {
  const seen = new Set<string>();
  records.forEach(record => seen.add(String(record.get(field))));
  return Array.from(seen);
}

export function buildCategoryScale(values: string[], range: [number, number]) {
  return scaleBand<string>().domain(values).range(range).padding(0.3);
}

// No bar series to give a category a width, so the axis reads as points instead of bands — the
// first and last categories sit exactly at the plot edges, and a line/area runs edge to edge.
export function buildPointScale(values: string[], range: [number, number]) {
  return scalePoint<string>().domain(values).range(range).padding(0);
}

export function buildTimeScale(records: DataModel<any>[], field: string, range: [number, number]) {
  const dates = records.map(record => new Date(record.get(field)));
  return scaleTime().domain([Math.min(...dates.map(d => d.getTime())), Math.max(...dates.map(d => d.getTime()))].map(t => new Date(t))).range(range);
}

// `tickCount` must be the same count the axis renders with (`.ticks(tickCount)`) — `.nice()` with
// no count assumes ~10 and rounds to a step that may stop short of a smaller rendered tick count,
// which is how data drew past the last gridline.
export function buildLinearScale(min: number, max: number, range: [number, number], tickCount?: number) {
  const scale = scaleLinear().domain([Math.min(0, min), Math.max(0, max)]).range(range);
  return tickCount === undefined ? scale.nice() : scale.nice(tickCount);
}

const POINT_DOMAIN_PADDING_RATIO = 0.1;

// Scatter/bubble domains don't anchor at 0 the way a bar's does — padding both ends by a share of
// the data's own span keeps a mark at the extreme (say cost = 0) off the plot edge, radius and all.
export function padDomain(min: number, max: number): [number, number] {
  const span = max - min || 1,
        pad = span * POINT_DOMAIN_PADDING_RATIO;

  return [min - pad, max + pad];
}

export function buildPaddedScale(min: number, max: number, range: [number, number], tickCount?: number) {
  const [paddedMin, paddedMax] = padDomain(min, max),
        scale = scaleLinear().domain([paddedMin, paddedMax]).range(range);

  return tickCount === undefined ? scale.nice() : scale.nice(tickCount);
}

export function buildSizeScale(min: number, max: number, radiusRange: [number, number] = [4, 24]) {
  return scaleSqrt().domain([Math.max(0, min), Math.max(max, 1)]).range(radiusRange);
}

export function pickTickCount(availableLength: number, minGapPx: number) {
  return Math.max(2, Math.min(8, Math.floor(availableLength / minGapPx)));
}

export function formatTickValue(value: number, format?: ColumnFormat) {
  return formatCellText(value, format ?? 'compact');
}

const CATEGORY_LABEL_GAP_PX = 8;
const CATEGORY_LINE_HEIGHT_PX = 14;

// The bottom category axis: each label reads left-to-right, so it only collides with its
// neighbour when its own measured width is wider than the slot (band + padding) it sits under.
export function thinHorizontalCategoryLabels(values: string[], slotWidth: number, font: string): { value: string, label: string }[] {
  if (!values.length) return [];

  const widest = Math.max(...values.map(v => measureText(v, font)));
  if (widest + CATEGORY_LABEL_GAP_PX <= slotWidth) return values.map(value => ({ value, label: value }));

  const step = Math.max(1, Math.ceil((widest + CATEGORY_LABEL_GAP_PX) / slotWidth)),
        survivorWidth = slotWidth * step - CATEGORY_LABEL_GAP_PX;

  return values
    .filter((_, index) => index % step === 0)
    .map(value => ({ value, label: truncateLabel(value, Math.max(survivorWidth, 24), font) }));
}

// The left category axis of a horizontal-bar chart: each label is one line sitting beside its own
// bar, so what it collides on is line height against the slot's height, never its own text width.
export function thinVerticalCategoryLabels(values: string[], slotHeight: number, maxLabelWidth: number, font: string): { value: string, label: string }[] {
  if (!values.length) return [];

  const step = slotHeight >= CATEGORY_LINE_HEIGHT_PX ? 1 : Math.max(1, Math.ceil(CATEGORY_LINE_HEIGHT_PX / slotHeight));

  return values
    .filter((_, index) => index % step === 0)
    .map(value => ({ value, label: truncateLabel(value, Math.max(maxLabelWidth, 24), font) }));
}

export type PositionedTick<T> = { tick: T, position: number, label: string }

// d3's own tick-count target is a hint, not a guarantee — a time scale's interval list is coarse
// (day, then a jump to week), so the returned tick count can overshoot and collide at this box
// width. Thinning against the actual pixel spacing (not the requested count) catches that.
export function thinPositionedTicks<T>(items: PositionedTick<T>[], font: string): PositionedTick<T>[] {
  if (items.length < 3) return items;

  const gap = 8,
        widest = Math.max(...items.map(item => measureText(item.label, font))),
        spacing = Math.abs(items[1].position - items[0].position) || 1,
        step = Math.max(1, Math.ceil((widest + gap) / spacing));

  return items.filter((_, index) => index % step === 0);
}

export function axisFor(axes: ChartAxis[] | undefined, position: string): ChartAxis | undefined {
  return axes?.find(axis => axis.position === position);
}

export function isHorizontalOrientation(axes: ChartAxis[] | undefined) {
  const sideAxis = axes?.find(axis => axis.position === 'left' || axis.position === 'right');
  return !!sideAxis && (sideAxis.type === AXIS_TYPE.category || sideAxis.type === AXIS_TYPE.time);
}
