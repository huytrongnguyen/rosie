const TOOLTIP_GAP_PX = 12;

export type TooltipPosition = { left: number, top: number };

export function positionTooltip(anchorX: number, anchorY: number, tooltipWidth: number, tooltipHeight: number, boxWidth: number, boxHeight: number): TooltipPosition {
  const fitsRight = anchorX + TOOLTIP_GAP_PX + tooltipWidth <= boxWidth,
        left = fitsRight ? anchorX + TOOLTIP_GAP_PX : anchorX - TOOLTIP_GAP_PX - tooltipWidth;

  const fitsBelow = anchorY + TOOLTIP_GAP_PX + tooltipHeight <= boxHeight,
        top = fitsBelow ? anchorY + TOOLTIP_GAP_PX : anchorY - TOOLTIP_GAP_PX - tooltipHeight;

  return {
    left: Math.max(0, Math.min(left, boxWidth - tooltipWidth)),
    top: Math.max(0, Math.min(top, boxHeight - tooltipHeight)),
  };
}
