import { initClose } from './close';
import { initCollapse } from './collapse';
import { initDropdown } from './dropdown';
import { initGrid } from './grid';
import { initModal } from './modal';
import { initTab } from './tab';
import { initTooltip } from './tooltip';

export * from './target';
export * from './collapse';
export * from './dropdown';
export * from './grid';
export * from './tab';
export * from './modal';
export * from './close';
export * from './tooltip';

export function initPlugins() {
  initCollapse();
  initDropdown();
  initTab();
  initModal();
  initClose();
  initTooltip();
  initGrid();
}
