import { CSSProperties, useEffect, useRef, useState } from 'react';
import { PopoverAlign, bindPopover } from '../core';

export function usePopover(align?: PopoverAlign, width?: number) {
  const [open, setOpen] = useState(false),
        [panelStyle, setPanelStyle] = useState<CSSProperties>(),
        triggerRef = useRef<HTMLButtonElement>(null),
        panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    return bindPopover({
      trigger: triggerRef.current,
      panel: panelRef.current,
      align,
      width,
      place: setPanelStyle,
      dismiss: () => setOpen(false),
    });
  }, [open, align, width]);

  return { open, setOpen, triggerRef, panelRef, panelStyle };
}
