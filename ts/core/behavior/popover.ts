import { onEscape, onOutsideClick } from './dismiss';

export type PopoverAlign = 'start' | 'end';

export type PopoverPlacement = {
  position: 'fixed',
  width: string,
  minWidth: string,
  left: string,
  right: string,
  top: string,
  bottom: string,
}

export type PopoverBinding = {
  trigger: HTMLElement | null,
  panel: HTMLElement | null,
  align?: PopoverAlign,
  width?: number,
  place: (placement: PopoverPlacement) => void,
  dismiss: () => void,
}

const PANEL_GAP_PX = 4;

export function anchorPanel(trigger: HTMLElement | null, panel: HTMLElement | null, align?: PopoverAlign, width?: number): PopoverPlacement | undefined {
  if (!trigger || !panel) return undefined;

  const rect = trigger.getBoundingClientRect(),
        spaceBelow = window.innerHeight - rect.bottom,
        spaceAbove = rect.top,
        dropUp = spaceBelow < panel.offsetHeight && spaceAbove > spaceBelow;

  return {
    position: 'fixed',
    width: width ? `${width}px` : '',
    minWidth: `${width ?? rect.width}px`,
    left: align === 'end' ? '' : `${rect.left}px`,
    right: align === 'end' ? `${window.innerWidth - rect.right}px` : '',
    top: dropUp ? '' : `${rect.bottom + PANEL_GAP_PX}px`,
    bottom: dropUp ? `${window.innerHeight - rect.top + PANEL_GAP_PX}px` : '',
  };
}

export function clearPlacement(panel: HTMLElement | null) {
  if (!panel) return;

  Object.assign(panel.style, { position: '', width: '', minWidth: '', left: '', right: '', top: '', bottom: '' });
}

export function bindPopover({ trigger, panel, align, width, place, dismiss }: PopoverBinding) {
  const reposition = () => {
    const placement = anchorPanel(trigger, panel, align, width);
    if (placement) place(placement);
  };

  reposition();
  window.addEventListener('resize', reposition);
  window.addEventListener('scroll', reposition, true);

  const releaseEscape = onEscape(dismiss),
        releaseOutsideClick = onOutsideClick([trigger, panel], dismiss);

  return () => {
    window.removeEventListener('resize', reposition);
    window.removeEventListener('scroll', reposition, true);
    releaseEscape();
    releaseOutsideClick();
  };
}
