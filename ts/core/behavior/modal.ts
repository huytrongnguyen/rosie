const BODY_OPEN_CLASS = 'modal-open';

export function lockModal(dialog: HTMLElement | null) {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  document.body.classList.add(BODY_OPEN_CLASS);
  dialog?.focus();

  return () => {
    if (!document.querySelector('.modal.show')) document.body.classList.remove(BODY_OPEN_CLASS);
    previouslyFocused?.focus();
  };
}
