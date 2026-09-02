import { resolveTarget } from './target';

const COLLAPSE_TRIGGER = '[data-rosie-toggle="collapse"]';

let installed = false;

export function initCollapse() {
  if (installed) return;
  installed = true;

  document.addEventListener('click', event => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>(COLLAPSE_TRIGGER);
    if (!trigger) return;

    event.preventDefault();
    toggleCollapse(trigger);
  });
}

export function toggleCollapse(trigger: HTMLElement) {
  const target = resolveTarget(trigger);
  if (!target) return;

  const parentSelector = trigger.dataset.rosieParent,
        parent = parentSelector ? document.querySelector(parentSelector) : null;

  if (parent && !target.classList.contains('show')) collapseSiblings(parent, target);

  setCollapsed(trigger, target, !target.classList.contains('show'));
}

function collapseSiblings(parent: Element, except: Element) {
  parent.querySelectorAll<HTMLElement>(COLLAPSE_TRIGGER).forEach(trigger => {
    const target = resolveTarget(trigger);
    if (target && target !== except && target.classList.contains('show')) setCollapsed(trigger, target, false);
  });
}

function setCollapsed(trigger: HTMLElement, target: HTMLElement, shown: boolean) {
  target.classList.toggle('show', shown);
  trigger.classList.toggle('collapsed', !shown);
  trigger.setAttribute('aria-expanded', String(shown));
}
