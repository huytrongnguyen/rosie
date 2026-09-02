const CLOSE_TRIGGER = '[data-rosie-dismiss="alert"],[data-rosie-dismiss="toast"]';

let installed = false;

export function initClose() {
  if (installed) return;
  installed = true;

  document.addEventListener('click', event => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>(CLOSE_TRIGGER);
    if (!trigger) return;

    trigger.closest(`.${trigger.dataset.rosieDismiss}`)?.remove();
  });
}
