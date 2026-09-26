let sharedContext: CanvasRenderingContext2D | null | undefined;

export function measureText(text: string, font = '12px sans-serif'): number {
  if (sharedContext === undefined) sharedContext = document.createElement('canvas').getContext('2d');
  if (!sharedContext) return text.length * 7;

  sharedContext.font = font;
  return sharedContext.measureText(text).width;
}

export function truncateLabel(text: string, maxWidth: number, font: string): string {
  if (measureText(text, font) <= maxWidth) return text;

  const ellipsis = '…';
  let low = 0, high = text.length;

  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (measureText(text.slice(0, mid) + ellipsis, font) <= maxWidth) low = mid;
    else high = mid - 1;
  }

  return low === 0 ? ellipsis : text.slice(0, low) + ellipsis;
}
