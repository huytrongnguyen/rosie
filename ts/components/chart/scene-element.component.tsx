import { CSSProperties, PointerEvent } from 'react';
import { SceneAttrs, SceneNode } from '../../core';

const ATTR_ALIASES: Record<string, string> = {
  'text-anchor': 'textAnchor',
  'dominant-baseline': 'dominantBaseline',
};

function attrsToProps(attrs: SceneAttrs) {
  const props: Record<string, string | number> = {};
  Object.entries(attrs).forEach(([name, value]) => { props[ATTR_ALIASES[name] ?? name] = value; });
  return props;
}

type SceneElementProps = {
  node: SceneNode,
  onPointerEnter?: (node: SceneNode, event: PointerEvent) => void,
  onPointerLeave?: (node: SceneNode) => void,
}

export function SceneElement({ node, onPointerEnter, onPointerLeave }: Readonly<SceneElementProps>) {
  const Tag = node.tag as any,
        hoverable = !!node.datum && (onPointerEnter || onPointerLeave);

  return <Tag className={node.className} style={node.style as CSSProperties} {...attrsToProps(node.attrs)}
              onPointerEnter={hoverable ? (event: PointerEvent) => onPointerEnter?.(node, event) : undefined}
              onPointerLeave={hoverable ? () => onPointerLeave?.(node) : undefined}>
    {node.text}
    {node.children?.map(child => <SceneElement key={child.key} node={child} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} />)}
  </Tag>
}
