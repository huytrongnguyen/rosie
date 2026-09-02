import { PopoverAlign, bindPopover, clearPlacement } from '../behavior';
import { resolveTarget } from './target';

const DROPDOWN_TRIGGER = '[data-rosie-toggle="dropdown"]';

let installed = false,
    openTrigger: HTMLElement = null,
    release: () => void = null;

export function initDropdown() {
  if (installed) return;
  installed = true;

  document.addEventListener('click', event => {
    const target = event.target as HTMLElement,
          trigger = target.closest<HTMLElement>(DROPDOWN_TRIGGER);

    if (trigger) {
      event.preventDefault();
      trigger === openTrigger ? closeDropdown() : openDropdown(trigger);
      return;
    }

    if (openTrigger && target.closest('.dropdown-item')) closeDropdown();
  });
}

export function openDropdown(trigger: HTMLElement) {
  const menu = findMenu(trigger);
  if (!menu) return;

  closeDropdown();

  openTrigger = trigger;
  trigger.classList.add('show');
  menu.classList.add('show');

  release = bindPopover({
    trigger,
    panel: menu,
    align: trigger.dataset.rosieAlign as PopoverAlign,
    place: placement => Object.assign(menu.style, placement),
    dismiss: closeDropdown,
  });
}

export function closeDropdown() {
  if (!openTrigger) return;

  const menu = findMenu(openTrigger);
  openTrigger.classList.remove('show');
  menu?.classList.remove('show');
  clearPlacement(menu);

  release?.();
  openTrigger = release = null;
}

function findMenu(trigger: HTMLElement) {
  return resolveTarget(trigger) ?? trigger.parentElement?.querySelector<HTMLElement>('.dropdown-menu');
}
