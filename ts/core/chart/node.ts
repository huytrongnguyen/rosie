export type SceneTag = 'g' | 'path' | 'rect' | 'line' | 'circle' | 'text';

export type SceneAttrs = Record<string, string | number>;

export type SceneNode = {
  key: string,
  tag: SceneTag,
  attrs: SceneAttrs,
  className?: string,
  style?: Record<string, string>,
  text?: string,
  children?: SceneNode[],
  datum?: any,
  enter?: SceneAttrs,
  exit?: SceneAttrs,
  arc?: SceneArc,
}

export type SceneArc = { startAngle: number, endAngle: number, innerRadius: number, outerRadius: number }

export function colorStyle(color?: string): Record<string, string> | undefined {
  return color ? { '--rosie-chart-mark-color': color } : undefined;
}

const MAX_BAR_THICKNESS_PX = 24;
const BAR_GAP_PX = 2;

export function barThickness(bandWidth: number, seriesCount: number) {
  const gapTotal = (seriesCount - 1) * BAR_GAP_PX,
        available = Math.max(0, bandWidth - gapTotal) / seriesCount;
  return Math.min(MAX_BAR_THICKNESS_PX, available);
}
