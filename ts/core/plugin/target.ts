export function resolveTarget(trigger: HTMLElement) {
  const selector = trigger.dataset.rosieTarget ?? trigger.getAttribute('href') ?? '';
  if (!selector || selector === '#') return null;

  return document.querySelector<HTMLElement>(selector);
}
