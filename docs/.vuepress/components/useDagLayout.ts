import dagre from '@dagrejs/dagre'
import type { Node, Edge } from '@vue-flow/core'

const CARD_WIDTH = 320
const CARD_HEIGHT = 360

export function useLayout() {
  function layout(nodes: Node[], edges: Edge[], direction: 'TB' | 'LR' = 'TB') {
    const g = new dagre.graphlib.Graph()
    g.setDefaultEdgeLabel(() => ({}))
    g.setGraph({
      rankdir: direction,
      nodesep: 160,
      ranksep: 180,
      edgesep: 80,
      marginx: 120,
      marginy: 80,
    })

    for (const node of nodes) {
      g.setNode(node.id, { width: CARD_WIDTH, height: CARD_HEIGHT })
    }

    for (const edge of edges) {
      g.setEdge(edge.source, edge.target)
    }

    dagre.layout(g)

    return nodes.map(node => {
      const n = g.node(node.id)
      if (!n) return node
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
