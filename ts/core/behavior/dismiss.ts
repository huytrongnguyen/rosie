export function onEscape(dismiss: () => void) {
  const dismissOnEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') dismiss();
  };

  document.addEventListener('keydown', dismissOnEscape);
  return () => document.removeEventListener('keydown', dismissOnEscape);
}

export function onOutsideClick(elements: (HTMLElement | null)[], dismiss: () => void) {
  const dismissOnOutsideClick = (event: MouseEvent) => {
    const target = event.target as Node;
    if (elements.every(element => !element?.contains(target))) dismiss();
  };

  document.addEventListener('mousedown', dismissOnOutsideClick);
  return () => document.removeEventListener('mousedown', dismissOnOutsideClick);
}
