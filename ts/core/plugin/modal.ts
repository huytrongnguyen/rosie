import { lockModal, onEscape } from '../behavior';
import { resolveTarget } from './target';

const MODAL_TRIGGER = '[data-rosie-toggle="modal"]';
const MODAL_DISMISS = '[data-rosie-dismiss="modal"]';

let installed = false,
    backdrop: HTMLElement = null,
    release: () => void = null;

export function initModal() {
  if (installed) return;
  installed = true;

  document.addEventListener('click', event => {
    const target = event.target as HTMLElement,
          trigger = target.closest<HTMLElement>(MODAL_TRIGGER);

    if (trigger) {
      event.preventDefault();
      showModal(resolveTarget(trigger));
      return;
    }

    const dismissed = target.closest<HTMLElement>(MODAL_DISMISS)?.closest<HTMLElement>('.modal');
    hideModal(dismissed ?? (target.classList.contains('modal') ? target : null));
  });
}

export function showModal(modal: HTMLElement) {
  if (!modal) return;

  modal.classList.add('show');

  backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop show';
  document.body.append(backdrop);

  const releaseLock = lockModal(modal),
        releaseEscape = onEscape(() => hideModal(modal));

  release = () => {
    releaseLock();
    releaseEscape();
  };
}

export function hideModal(modal: HTMLElement) {
  if (!modal) return;

  modal.classList.remove('show');
  backdrop?.remove();
  release?.();
  backdrop = release = null;
}
