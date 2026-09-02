import { PropsWithChildren, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Rosie, lockModal, onEscape } from '../core';

export type DialogProps = {
  title: string,
  onClose: () => void,
  className?: string,
  closable?: boolean,
}

export function Dialog({ title, onClose, className = '', closable = true, children }: Readonly<PropsWithChildren<DialogProps>>) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => lockModal(dialogRef.current), []);

  useEffect(() => {
    if (!closable) return;
    return onEscape(onClose);
  }, [closable, onClose]);

  return createPortal(<>
    <div className="modal-backdrop show" />

    <div ref={dialogRef} className="modal show" tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}>
      <div className={Rosie.classNames('modal-dialog modal-dialog-centered modal-dialog-scrollable', className)}>
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-title">{title}</div>
            {closable && <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />}
          </div>
          {children}
        </div>
      </div>
    </div>
  </>, document.body);
}
