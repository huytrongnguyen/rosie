import { Rosie, LegendItem, chartColorClass, isLineKey } from '../../core';

type ChartLegendProps = {
  items: LegendItem[],
  hiddenKeys: Set<string>,
  highlightedKey: string | null,
  onToggle: (key: string) => void,
  onHighlight: (key: string | null) => void,
}

export function ChartLegend({ items, hiddenKeys, highlightedKey, onToggle, onHighlight }: Readonly<ChartLegendProps>) {
  return <div className="rosie-chart-legend">
    {items.map(item => {
      const active = !hiddenKeys.has(item.key);
      return <button key={item.key} type="button" aria-pressed={active}
                     className={Rosie.classNames('rosie-chart-legend-item', chartColorClass(item.colorIndex),
                       { 'is-hidden': !active, 'is-active': highlightedKey === item.key })}
                     onClick={() => onToggle(item.key)}
                     onPointerEnter={() => onHighlight(item.key)}
                     onPointerLeave={() => onHighlight(null)}>
        <span className={Rosie.classNames('rosie-chart-legend-swatch', { 'rosie-chart-legend-swatch-line': isLineKey(item.type) })} />
        {item.title}
      </button>
    })}
  </div>
}
