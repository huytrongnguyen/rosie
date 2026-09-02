let installed = false;

export function initGrid() {
  if (installed) return;
  installed = true;

  document.addEventListener('scroll', event => {
    const body = event.target;
    if (!(body instanceof HTMLElement) || !body.classList.contains('rosie-grid-body')) return;

    const header = body.closest('.rosie-grid')?.querySelector<HTMLElement>(':scope > .rosie-grid-header');
    if (header) header.scrollLeft = body.scrollLeft;
  }, true);
}
