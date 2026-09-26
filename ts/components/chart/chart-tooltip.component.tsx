import { CSSProperties } from 'react';
import { Rosie, TooltipModel, chartColorClass, isLineKey, positionTooltip } from '../../core';

type ChartTooltipProps = {
  tooltip: TooltipModel,
  boxWidth: number,
  boxHeight: number,
}

const ESTIMATED_WIDTH_PX = 200;
const ESTIMATED_HEIGHT_PX = 36;

export function ChartTooltip({ tooltip, boxWidth, boxHeight }: Readonly<ChartTooltipProps>) {
  const width = Math.max(ESTIMATED_WIDTH_PX, 0),
        height = ESTIMATED_HEIGHT_PX * (tooltip.rows.length || 1) + 24,
        { left, top } = positionTooltip(tooltip.x, tooltip.y, width, height, boxWidth, boxHeight),
        style: CSSProperties = { left, top };

  return <div className="rosie-chart-tooltip" style={style} role="tooltip">
    <div className="rosie-chart-tooltip-label">{tooltip.label}</div>
    {tooltip.rows.map(row =>
      <div key={row.title} className="rosie-chart-tooltip-row">
        <span className={Rosie.classNames('rosie-chart-tooltip-swatch', chartColorClass(row.colorIndex),
          { 'rosie-chart-tooltip-swatch-line': isLineKey(row.type) })} />
        <span className="rosie-chart-tooltip-value">{row.value}</span>
        <span className="rosie-chart-tooltip-title">{row.title}</span>
      </div>)}
  </div>
}
