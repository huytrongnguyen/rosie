import { ReactNode } from 'react';
import { Dialog } from './dialog.component';

export type ConfirmDialogProps = {
  title: string,
  message: ReactNode,
  confirmLabel?: string,
  cancelLabel?: string,
  variant?: string,
  onConfirm: () => void,
  onClose: () => void,
}

export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'primary', onConfirm, onClose }: Readonly<ConfirmDialogProps>) {
  return <Dialog title={title} onClose={onClose}>
    <div className="modal-body">{message}</div>
    <div className="modal-footer">
      <button type="button" className="btn btn-outline-secondary" onClick={onClose}>{cancelLabel}</button>
      <button type="button" className={`btn btn-${variant}`} onClick={onConfirm}>{confirmLabel}</button>
    </div>
  </Dialog>
}
