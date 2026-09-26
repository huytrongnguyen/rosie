import { arc as d3Arc, pie as d3Pie } from 'd3-shape';
import { DataModel } from '../data';
import { classNames } from '../mixins';
import { formatCellText } from '../grid/format';
import { CHART_TYPE, ChartConfig, ChartInteractionState, ChartSeries, ChartTooltipRow, LegendItem, TooltipModel, chartColorClass } from './types';
import { SceneNode, colorStyle } from './node';
import { ChartMargin } from './cartesian';

const OUTER_MARGIN_PX = 16;

export type RadialScene = {
  nodes: SceneNode[],
  legend: LegendItem[],
  ariaLabel: string,
  margin: ChartMargin,
  plotWidth: number,
  plotHeight: number,
  horizontal: boolean,
  hitTest: (pointerX: number, pointerY: number) => null,
}

export function buildRadialScene(config: ChartConfig, records: DataModel<any>[], size: { width: number, height: number }, state: ChartInteractionState): RadialScene {
  const series = config.series[0],
        donut = series?.type === CHART_TYPE.donut,
        margin: ChartMargin = { top: OUTER_MARGIN_PX, right: OUTER_MARGIN_PX, bottom: OUTER_MARGIN_PX, left: OUTER_MARGIN_PX },
        innerWidth = Math.max(0, size.width - margin.left - margin.right),
        innerHeight = Math.max(0, size.height - margin.top - margin.bottom),
        outerRadius = Math.max(0, Math.min(innerWidth, innerHeight) / 2),
        innerRadius = donut ? outerRadius * (series.innerRadius ?? 0.6) : 0;

  const slices = records.map((record, index) => ({
    key: String(record.get(config.xField)),
    record,
    colorIndex: index,
    value: series ? (record.get(series.field) ?? 0) : 0,
  }));

  const legend: LegendItem[] = slices.map(slice => ({ key: slice.key, title: slice.key, colorIndex: slice.colorIndex, type: series?.type ?? CHART_TYPE.pie }));

  const visible = slices.filter(slice => !state.hiddenKeys.has(slice.key));
  const total = visible.reduce((sum, slice) => sum + slice.value, 0) || 1;

  const arcs = d3Pie<typeof visible[number]>().value(d => d.value).sort(null)(visible);

  const arcGen = d3Arc<any>().innerRadius(innerRadius).outerRadius(outerRadius);
  const centroidGen = d3Arc<any>().innerRadius(innerRadius).outerRadius(outerRadius);

  const children: SceneNode[] = arcs.map(a => {
    const slice = a.data,
          colorClass = chartColorClass(slice.colorIndex),
          dimmed = !!state.highlightedKey && state.highlightedKey !== slice.key,
          className = classNames('rosie-chart-slice', colorClass, { 'is-dimmed': dimmed }),
          style = colorStyle(series?.color),
          arc = { startAngle: a.startAngle, endAngle: a.endAngle, innerRadius, outerRadius },
          d = arcGen(arc) ?? '';

    return {
      key: slice.key, tag: 'path', className, style,
      datum: { record: slice.record, series, colorIndex: slice.colorIndex, value: slice.value, share: slice.value / total, xField: config.xField },
      attrs: { d }, arc,
    };
  });

  const labels: SceneNode[] = series?.label ? arcs.map(a => {
    const [cx, cy] = centroidGen.centroid({ startAngle: a.startAngle, endAngle: a.endAngle, padAngle: a.padAngle } as any),
          share = a.data.value / total;

    return {
      key: `${a.data.key}-label`, tag: 'text', className: 'rosie-chart-slice-label',
      attrs: { x: cx, y: cy, 'text-anchor': 'middle', 'dominant-baseline': 'middle' },
      text: `${Math.round(share * 100)}%`,
    };
  }) : [];

  return {
    nodes: [{ key: 'plot', tag: 'g', attrs: { transform: `translate(${margin.left + innerWidth / 2},${margin.top + innerHeight / 2})` }, children: [...children, ...labels] }],
    legend,
    ariaLabel: `${series?.title ?? series?.field ?? config.xField} by ${config.xField}`,
    margin,
    plotWidth: innerWidth,
    plotHeight: innerHeight,
    horizontal: false,
    hitTest: () => null,
  };
}

export type RadialDatum = { record: DataModel<any>, series: ChartSeries, colorIndex: number, value: number, share: number, xField: string }

export function radialItemRows(datum: RadialDatum): { label: string, rows: ChartTooltipRow[] } {
  return {
    label: String(datum.record.get(datum.xField)),
    rows: [{
      title: datum.series?.title ?? datum.series?.field ?? '',
      value: `${formatCellText(datum.value, datum.series?.format ?? 'number')} (${Math.round(datum.share * 100)}%)`,
      colorIndex: datum.colorIndex,
      type: datum.series?.type ?? CHART_TYPE.pie,
    }],
  };
}
