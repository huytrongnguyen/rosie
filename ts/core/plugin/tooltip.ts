import { anchorPanel } from '../behavior';

const TOOLTIP_SOURCE = '[data-rosie-tooltip]';

let installed = false,
    tooltip: HTMLElement = null;

export function initTooltip() {
  if (installed) return;
  installed = true;

  document.addEventListener('mouseover', event => {
    const source = (event.target as HTMLElement).closest<HTMLElement>(TOOLTIP_SOURCE);
    if (source) showTooltip(source);
  });

  document.addEventListener('mouseout', event => {
    const source = (event.target as HTMLElement).closest<HTMLElement>(TOOLTIP_SOURCE),
          movedTo = event.relatedTarget as Node;

    if (source && !source.contains(movedTo)) hideTooltip();
  });
}

export function showTooltip(source: HTMLElement) {
  hideTooltip();

  const inner = document.createElement('div');
  inner.className = 'tooltip-inner';
  inner.textContent = source.dataset.rosieTooltip;

  tooltip = document.createElement('div');
  tooltip.className = 'tooltip show';
  tooltip.append(inner);
  document.body.append(tooltip);

  const placement = anchorPanel(source, tooltip);
  if (placement) Object.assign(tooltip.style, { ...placement, minWidth: '' });
}

export function hideTooltip() {
  tooltip?.remove();
  tooltip = null;
}
