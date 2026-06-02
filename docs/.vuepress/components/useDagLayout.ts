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
      nodesep: 120,
      ranksep: 150,
      edgesep: 60,
      marginx: 100,
      marginy: 60,
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
