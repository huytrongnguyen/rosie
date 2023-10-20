import { useEffect, useState } from 'react';
import { classNames, showModal } from 'src/util';

type DialogProps = {
  id?: string,
  className?: string,
  title?: string,
  dialogClass?: string,
  bodyClass?: string,
  disableCloseButton?: boolean,
  fitScreen?: boolean,
  height?: string | number,
  children: React.ReactNode,
}

export function Dialog(props: DialogProps) {
  const { id = 'dialog', title = 'Dialog', className = '', bodyClass = '', dialogClass = '', disableCloseButton, fitScreen, children } = props;

  return <section className={`modal fade ${className}`} id={id} data-bs-backdrop="static" tabIndex={-1} role="dialog">
    <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${dialogClass}`} role="document">
      <div className={classNames('modal-content', { fullscreen: fitScreen })} style={{maxHeight: props.height ?? '100%'}}>
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          {!disableCloseButton && <button type="button" className="btn-close" data-bs-dismiss="modal" />}
        </div>
        <div className={classNames('modal-body', bodyClass, { fullscreen: fitScreen })}>
          {children}
        </div>
      </div>
    </div>
  </section>
}

export function useDialog(id: string) {
  const [isShown, setState] = useState(false);

  useEffect(() => {
    if (isShown) {
      showModal(id, null, () => { setState(false) });
    }
  }, [isShown]);

  return {
    isShown,
    show: () => setState(true),
    hide: () => setState(false),
  };
}