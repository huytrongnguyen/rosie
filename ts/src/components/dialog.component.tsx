import { useEffect, useState } from 'react';
import { Rosie } from '../core';

type DialogProps = {
  id?: string,
  className?: string,
  title?: string,
  dialogClass?: string,
  disableCloseButton?: boolean,
  // fitScreen?: boolean,
  height?: string | number,
  children: React.ReactNode,
}

export function Dialog(props: DialogProps) {
  const { id = 'dialog', title = 'Dialog', className = '', dialogClass = '', disableCloseButton, children } = props;

  return <section className={`modal fade ${className}`} id={id} data-bs-backdrop="static" tabIndex={-1} role="dialog">
    <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${dialogClass}`} role="document">
      <div className={Rosie.classNames('modal-content')} style={{maxHeight: props.height ?? '100%'}}>
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          {!disableCloseButton && <button type="button" className="btn-close" data-bs-dismiss="modal" />}
        </div>
        {children}
      </div>
    </div>
  </section>
}

export function useDialog(id: string) {
  const [isShown, setState] = useState(false);

  useEffect(() => {
    if (isShown) {
      Rosie.showModal(id, undefined, () => { setState(false) });
    }
  }, [isShown]);

  return {
    isShown,
    show: () => setState(true),
    hide: () => setState(false),
  };
}