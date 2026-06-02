import dagre from '@dagrejs/dagre'
import type { Node, Edge } from '@vue-flow/core'

const CARD_WIDTH = 260
const CARD_HEIGHT = 180

export function useLayout() {
  function layout(nodes: Node[], edges: Edge[], direction: 'TB' | 'LR' = 'TB') {
    const g = new dagre.graphlib.Graph()
    g.setDefaultEdgeLabel(() => ({}))
    g.setGraph({
      rankdir: direction,
      nodesep: 60,
      ranksep: 80,
      edgesep: 40,
    })

    for (const node of nodes) {
      const w = (node as any).width ?? CARD_WIDTH
      const h = (node as any).height ?? CARD_HEIGHT
      g.setNode(node.id, { width: w, height: h })
    }

    for (const edge of edges) {
      g.setEdge(edge.source, edge.target)
    }

    dagre.layout(g)

    return nodes.map(node => {
      const n = g.node(node.id)
      return {
        ...node,
        position: {
          x: n.x - CARD_WIDTH / 2,
          y: n.y - CARD_HEIGHT / 2,
        },
      }
    })
  }

  return { layout }
}
