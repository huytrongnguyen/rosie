import { CSSProperties, PropsWithChildren, Ref } from 'react';
import { createPortal } from 'react-dom';

export type PopoverPanelProps = {
  ref?: Ref<HTMLDivElement>,
  className?: string,
  style?: CSSProperties,
  role?: string,
}

const LAYER_CLASS = 'rosie-popover-layer';

// An anchored panel is positioned against the viewport, which only holds while no ancestor is a
// containing block for it — and backdrop-filter makes every glass surface one. The panel is
// rendered into a layer on the body instead, out of reach of both that and any overflow: hidden.
export function PopoverPanel({ ref, className, style, role, children }: Readonly<PropsWithChildren<PopoverPanelProps>>) {
  return createPortal(<div ref={ref} className={className} style={style} role={role}>{children}</div>, popoverLayer());
}

function popoverLayer() {
  const existing = document.querySelector(`.${LAYER_CLASS}`);
  if (existing) return existing;

  const layer = document.createElement('div');
  layer.className = LAYER_CLASS;
  document.body.append(layer);
  return layer;
}
