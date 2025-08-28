import { Modal } from 'bootstrap';

export function showModal(selector: string, onShow?: () => void, onHide?: () => void) {
  const dialogEl = document.querySelector(selector);
  new Modal(dialogEl).show();
  onShow && dialogEl.addEventListener('shown.bs.modal', onShow);
  onHide && dialogEl.addEventListener('hide.bs.modal', onHide);
}

export function hideModal(selector: string, onHide?: () => void) {
  const dialogEl = document.querySelector(selector);
  new Modal(dialogEl).hide();
  onHide && dialogEl.addEventListener('hide.bs.modal', onHide);
}