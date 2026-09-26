import { DataModel } from '../data';
import { CHART_TYPE, ChartConfig, ChartInteractionState, LegendItem, TOOLTIP_TRIGGER, TooltipModel } from './types';
import { ChartMargin, buildCartesianScene } from './cartesian';
import { buildRadialScene } from './radial';
import { SceneNode } from './node';

export type ChartScene = {
  nodes: SceneNode[],
  legend: LegendItem[],
  showLegend: boolean,
  showTooltip: boolean,
  tooltipTrigger: string,
  ariaLabel: string,
  margin: ChartMargin,
  plotWidth: number,
  plotHeight: number,
  horizontal: boolean,
  hitTest: (pointerX: number, pointerY: number) => TooltipModel | null,
  isRadial: boolean,
}

export function isRadialConfig(config: ChartConfig) {
  return config.series.some(s => s.type === CHART_TYPE.pie || s.type === CHART_TYPE.donut);
}

function defaultTooltipTrigger(config: ChartConfig, radial: boolean): string {
  const explicit = config.tooltip !== false ? config.tooltip?.trigger : undefined;
  if (explicit) return explicit;
  if (radial) return TOOLTIP_TRIGGER.item;

  const hasAxisSeries = config.series.some(s => s.type === CHART_TYPE.line || s.type === CHART_TYPE.area || s.type === CHART_TYPE.bar);
  return hasAxisSeries ? TOOLTIP_TRIGGER.axis : TOOLTIP_TRIGGER.item;
}

export function buildScene(config: ChartConfig, records: DataModel<any>[], size: { width: number, height: number }, state: ChartInteractionState): ChartScene {
  const radial = isRadialConfig(config),
        built = radial
          ? buildRadialScene(config, records, size, state)
          : buildCartesianScene(config, records, size, state),
        itemCount = radial ? records.length : config.series.length;

  return {
    ...built,
    showLegend: config.legend !== false && itemCount >= 2,
    showTooltip: config.tooltip !== false,
    tooltipTrigger: defaultTooltipTrigger(config, radial),
    isRadial: radial,
  };
}
