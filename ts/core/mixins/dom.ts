import { Modal } from 'bootstrap';

export function showModal(selector: string, onShow?: () => void, onHide?: () => void) {
  const dialogEl = document.querySelector(selector);
  Modal.getOrCreateInstance(dialogEl).show();
  onShow && dialogEl.addEventListener('shown.bs.modal', onShow);
  onHide && dialogEl.addEventListener('hide.bs.modal', onHide);
}

export function hideModal(selector: string, onHide?: () => void) {
  const dialogEl = document.querySelector(selector);
  Modal.getInstance(dialogEl)?.hide();
  onHide && dialogEl.addEventListener('hide.bs.modal', onHide);
}