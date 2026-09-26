import { ColumnFormat } from '../grid/format';

export const CHART_TYPE = {
  line: 'line',
  area: 'area',
  bar: 'bar',
  pie: 'pie',
  donut: 'donut',
  scatter: 'scatter',
  bubble: 'bubble',
};

export const AXIS_TYPE = { category: 'category', time: 'time', numeric: 'numeric' };
export const AXIS_POSITION = { bottom: 'bottom', left: 'left', top: 'top', right: 'right' };
export const TOOLTIP_TRIGGER = { axis: 'axis', item: 'item' };
export const LEGEND_POSITION = { top: 'top', bottom: 'bottom', right: 'right' };

export type ChartSeries = {
  type: string,
  field: string,
  title?: string,
  format?: ColumnFormat,
  stack?: string,
  smooth?: boolean,
  label?: boolean,
  color?: string,
  sizeField?: string,
  innerRadius?: number,
}

export type ChartAxis = {
  type?: string,
  position?: string,
  title?: string,
  format?: ColumnFormat,
  min?: number,
  max?: number,
  grid?: boolean,
}

export type ChartLegend = {
  position?: string,
}

export type ChartTooltipRow = {
  title: string,
  value: string,
  colorIndex: number,
  type: string,
}

export type ChartTooltip = {
  trigger?: string,
  renderer?: (label: string, rows: ChartTooltipRow[]) => string,
}

export type ChartConfig = {
  xField: string,
  series: ChartSeries[],
  axes?: ChartAxis[],
  legend?: false | ChartLegend,
  tooltip?: false | ChartTooltip,
}

export type LegendItem = {
  key: string,
  title: string,
  colorIndex: number,
  type: string,
}

export type TooltipModel = {
  x: number,
  y: number,
  label: string,
  rows: ChartTooltipRow[],
}

export type ChartInteractionState = {
  hiddenKeys: Set<string>,
  highlightedKey: string | null,
}

export const CHART_COLOR_COUNT = 8;

export function chartColorClass(colorIndex: number) {
  return colorIndex < CHART_COLOR_COUNT ? `rosie-chart-color-${colorIndex + 1}` : 'rosie-chart-color-other';
}

export function seriesKey(series: ChartSeries, index: number) {
  return `${series.type}:${series.field}:${index}`;
}

export function isLineKey(type: string) {
  return type === CHART_TYPE.line;
}
