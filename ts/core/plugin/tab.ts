import { resolveTarget } from './target';

const TAB_TRIGGER = '[data-rosie-toggle="tab"]';

let installed = false;

export function initTab() {
  if (installed) return;
  installed = true;

  document.addEventListener('click', event => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>(TAB_TRIGGER);
    if (!trigger) return;

    event.preventDefault();
    activateTab(trigger);
  });
}

export function activateTab(trigger: HTMLElement) {
  const pane = resolveTarget(trigger);
  if (!pane) return;

  trigger.closest('.nav')?.querySelectorAll('.nav-link.active').forEach(link => {
    link.classList.remove('active');
    link.setAttribute('aria-selected', 'false');
  });
  trigger.classList.add('active');
  trigger.setAttribute('aria-selected', 'true');

  pane.parentElement?.querySelectorAll(':scope > .tab-pane').forEach(sibling => sibling.classList.remove('active', 'show'));
  pane.classList.add('active', 'show');
}
