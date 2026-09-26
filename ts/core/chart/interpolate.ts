import { interpolate, interpolateString } from 'd3-interpolate';
import { arc as d3Arc } from 'd3-shape';
import { SceneArc, SceneNode } from './node';

export function interpolateScene(from: SceneNode[], to: SceneNode[], t: number): SceneNode[] {
  const fromByKey = new Map(from.map(node => [node.key, node])),
        toByKey = new Map(to.map(node => [node.key, node]));

  const current = to.map(node => interpolateNode(fromByKey.get(node.key) ?? enterNode(node), node, t));

  const exiting = t >= 1 ? [] : from
    .filter(node => !toByKey.has(node.key))
    .map(node => interpolateNode(node, exitNode(node), t));

  return [...exiting, ...current];
}

function enterNode(node: SceneNode): SceneNode {
  if (node.arc) return { ...node, arc: { ...node.arc, endAngle: node.arc.startAngle } };
  return node.enter ? { ...node, attrs: { ...node.attrs, ...node.enter } } : node;
}

function exitNode(node: SceneNode): SceneNode {
  if (node.arc) return { ...node, arc: { ...node.arc, startAngle: node.arc.endAngle } };
  return node.exit ? { ...node, attrs: { ...node.attrs, ...node.exit } } : node;
}

function interpolateNode(from: SceneNode, to: SceneNode, t: number): SceneNode {
  const attrs: Record<string, string | number> = {};

  Object.keys(to.attrs).forEach(name => {
    const a = from.attrs[name], b = to.attrs[name];

    if (a === undefined || a === b) attrs[name] = b;
    else if (typeof a === 'number' && typeof b === 'number') attrs[name] = interpolate(a, b)(t);
    else if (typeof a === 'string' && typeof b === 'string') attrs[name] = interpolateString(a, b)(t);
    else attrs[name] = t < 1 ? a : b;
  });

  const children = to.children ? interpolateScene(from.children ?? [], to.children, t) : undefined;

  if (from.arc && to.arc) {
    const arc = interpolateArc(from.arc, to.arc, t);
    return { ...to, arc, attrs: { ...attrs, d: d3Arc<SceneArc>()(arc) ?? '' }, children };
  }

  return { ...to, attrs, children };
}

// An arc's path string carries a large-arc flag that flips from 0 to 1 as a slice passes half the
// circle; tweening the string tweens the flag too, which draws torn shapes. Tween the angles instead.
function interpolateArc(from: SceneArc, to: SceneArc, t: number): SceneArc {
  return {
    startAngle: interpolate(from.startAngle, to.startAngle)(t),
    endAngle: interpolate(from.endAngle, to.endAngle)(t),
    innerRadius: interpolate(from.innerRadius, to.innerRadius)(t),
    outerRadius: interpolate(from.outerRadius, to.outerRadius)(t),
  };
}
