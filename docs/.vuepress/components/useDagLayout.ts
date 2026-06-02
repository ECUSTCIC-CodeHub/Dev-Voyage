/**
 * useDagLayout — pure DAG layout computation
 *
 * Powers a custom SVG-based DAG visualization (no cytoscape).
 * Three responsibilities:
 *   1. identifyMainLine  — follow non-dashed edges through main/converge nodes
 *   2. computePositions  — assign (x, y) to every node inside the canvas
 *   3. buildEdgePaths    — produce SVG path d-strings for all edges
 *
 * Used by AmadeusNavigator.vue; data comes from page frontmatter (YAML).
 */

export interface DagNode {
  id: string
  label: string
  type: 'main' | 'branch' | 'converge' | 'deadend'
  path?: string
  bgImage?: string
}

export interface DagEdge {
  from: string
  to: string
  dashed?: boolean
}

export interface NodePosition {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface EdgePath {
  from: string
  to: string
  d: string
  dashed: boolean
  isConverge: boolean
}

/* ── constants ──────────────────────────────────────────────────── */

export const CARD_WIDTH = 240
export const CARD_HEIGHT = 160

/** X position of the main vertical line (ratio of canvas width). */
const MAIN_LINE_X_RATIO = 0.5

/** Branch columns — distance from left edge (ratio). 3 left + 3 right = 6 columns total. */
const BRANCH_COLUMNS = [
  0.35, 0.22, 0.08,  // left side: inner → outer
  0.65, 0.78, 0.92,  // right side: inner → outer
]

/** Vertical spacing between branches stacked in the same column. */
const BRANCH_Y_SPACING = CARD_HEIGHT + 30

/** Top/bottom margin inside the canvas. */
const CANVAS_MARGIN_Y = 100

/** Minimum gap between adjacent cards to prevent overlap. */
const MIN_CARD_GAP = 10

/* ── identifyMainLine ───────────────────────────────────────────── */

/**
 * Walk the graph along non-dashed edges, starting from the root, and
 * collect the ordered list of node IDs that form the "golden path".
 *
 * Rules:
 *   - root = a `main` node with no non-dashed parent
 *   - from any main/converge node, follow the child that is itself
 *     main/converge (never a branch/deadend, never a dashed edge)
 *   - never revisit a node
 *
 * If the graph has no main-typed root, returns an empty array.
 */
export function identifyMainLine(
  nodes: DagNode[],
  edges: DagEdge[],
): string[] {
  // Adjacency maps restricted to non-dashed edges.
  const childMap = new Map<string, string[]>()
  const parentCount = new Map<string, number>()

  for (const e of edges) {
    if (e.dashed) continue
    const list = childMap.get(e.from) ?? []
    list.push(e.to)
    childMap.set(e.from, list)
    parentCount.set(e.to, (parentCount.get(e.to) ?? 0) + 1)
  }

  // Find root: a 'main' node with no non-dashed parent.
  const mainNodes = nodes.filter(n => n.type === 'main')
  if (mainNodes.length === 0) return []

  const root = mainNodes.find(n => !parentCount.has(n.id))
  if (!root) return []

  // Walk forward, following the main/converge child only.
  const mainLine: string[] = []
  const visited = new Set<string>()
  let current: string | undefined = root.id

  while (current && !visited.has(current)) {
    const node = nodes.find(n => n.id === current)
    if (!node) break

    visited.add(current)
    mainLine.push(current)

    // Only follow a non-dashed child that is main or converge.
    const children: string[] = childMap.get(current) ?? []
    const next: string | undefined = children.find((id: string) => {
      if (visited.has(id)) return false
      const c = nodes.find(n => n.id === id)
      return !!c && (c.type === 'main' || c.type === 'converge')
    })
    current = next
  }

  return mainLine
}

/* ── computePositions ───────────────────────────────────────────── */

/**
 * Compute (x, y) for every node given canvas dimensions.
 *
 * Layout strategy:
 *   - Main line: vertical center column, evenly spaced top→bottom.
 *   - Branches: spread across 6 columns (3 left + 3 right).
 *     Each branch is anchored to its nearest main-line node.
 *     Within each anchor-group, branches stack vertically near the anchor's Y.
 *     A greedy collision-detection pass shifts cards away from each other.
 */
export function computePositions(
  nodes: DagNode[],
  edges: DagEdge[],
  canvasWidth: number,
  canvasHeight: number,
): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>()
  if (nodes.length === 0) return positions

  const mainLine = identifyMainLine(nodes, edges)
  const mainLineSet = new Set(mainLine)
  const nodeIndex = new Map(nodes.map(n => [n.id, n]))

  const mainX = canvasWidth * MAIN_LINE_X_RATIO
  const columnXs = BRANCH_COLUMNS.map(r => canvasWidth * r)

  // ── Place the main line ──
  const mainCount = mainLine.length
  const usableHeight = Math.max(canvasHeight - CANVAS_MARGIN_Y * 2, 0)
  const mainSpacing = mainCount > 1 ? usableHeight / (mainCount - 1) : 0

  for (let i = 0; i < mainCount; i++) {
    const id = mainLine[i]
    const y = mainCount > 1
      ? CANVAS_MARGIN_Y + mainSpacing * i - CARD_HEIGHT / 2
      : canvasHeight / 2 - CARD_HEIGHT / 2
    positions.set(id, {
      id,
      x: mainX - CARD_WIDTH / 2,
      y,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    })
  }

  // ── Build neighbour map (all edges, bidirectional) ──
  const neighbours = new Map<string, string[]>()
  for (const e of edges) {
    const fl = neighbours.get(e.from) ?? []
    fl.push(e.to); neighbours.set(e.from, fl)
    const tl = neighbours.get(e.to) ?? []
    tl.push(e.from); neighbours.set(e.to, tl)
  }

  // ── BFS-anchor every non-main node to nearest main node ──
  const anchored = new Map<string, { anchor: string; distance: number }>()
  for (const node of nodes) {
    if (mainLineSet.has(node.id)) continue
    const visited = new Set<string>([node.id])
    const queue: [string, number][] = [[node.id, 0]]
    let found: { anchor: string; distance: number } | undefined
    while (queue.length > 0) {
      const [cur, dist] = queue.shift()!
      for (const nb of neighbours.get(cur) ?? []) {
        if (visited.has(nb)) continue
        visited.add(nb)
        if (mainLineSet.has(nb)) {
          found = { anchor: nb, distance: dist + 1 }
          queue.length = 0
          break
        }
        queue.push([nb, dist + 1])
      }
    }
    if (found) anchored.set(node.id, found)
  }

  // Group non-main nodes by anchor
  const anchorGroups = new Map<string, string[]>()
  for (const [nodeId, { anchor }] of anchored) {
    const list = anchorGroups.get(anchor) ?? []
    list.push(nodeId)
    anchorGroups.set(anchor, list)
  }

  // ── Place anchored branches with collision avoidance ──
  // Strategy: for each anchor group, try to place cards near the anchor's Y.
  // Scan columns left→right, place the card where it doesn't overlap.
  // If all columns have overlap, pick the one with least overlap and shift.

  for (const [anchorId, branchIds] of anchorGroups) {
    const anchorPos = positions.get(anchorId)!
    const anchorY = anchorPos.y + CARD_HEIGHT / 2
    const n = branchIds.length

    // Distribute branches evenly around the anchor's Y
    const startY = anchorY - ((n - 1) / 2) * BRANCH_Y_SPACING

    // Sort branchIds by their label/id for stable ordering
    branchIds.sort()

    branchIds.forEach((branchId, idx) => {
      const idealY = startY + idx * BRANCH_Y_SPACING

      // Try each column, find the best fit
      let bestCol = 0
      let bestY = idealY
      let bestOverlap = Infinity

      for (let ci = 0; ci < columnXs.length; ci++) {
        const cx = columnXs[ci] - CARD_WIDTH / 2
        const candidate = { x: cx, y: idealY, width: CARD_WIDTH, height: CARD_HEIGHT }

        // Measure overlap with all placed cards
        let totalOverlap = 0
        for (const placed of positions.values()) {
          const ox = Math.max(0, Math.min(
            candidate.x + candidate.width,
            placed.x + placed.width
          ) - Math.max(candidate.x, placed.x))
          const oy = Math.max(0, Math.min(
            candidate.y + candidate.height,
            placed.y + placed.height
          ) - Math.max(candidate.y, placed.y))
          if (ox > 0 && oy > 0) totalOverlap += ox * oy
        }

        if (totalOverlap === 0) {
          bestCol = ci; bestY = idealY; bestOverlap = 0
          break
        }
        if (totalOverlap < bestOverlap) {
          bestOverlap = totalOverlap
          bestCol = ci
          bestY = idealY
        }
      }

      // If still overlapping, shift down until clear
      if (bestOverlap > 0) {
        let shiftedY = bestY
        const maxIter = 100
        for (let iter = 0; iter < maxIter; iter++) {
          const candidate = {
            x: columnXs[bestCol] - CARD_WIDTH / 2,
            y: shiftedY,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          }
          let overlap = 0
          for (const placed of positions.values()) {
            const ox = Math.max(0, Math.min(
              candidate.x + candidate.width,
              placed.x + placed.width
            ) - Math.max(candidate.x, placed.x))
            const oy = Math.max(0, Math.min(
              candidate.y + candidate.height,
              placed.y + placed.height
            ) - Math.max(candidate.y, placed.y))
            if (ox > 0 && oy > 0) overlap += ox * oy
          }
          if (overlap === 0) { bestY = shiftedY; break }
          shiftedY += CARD_HEIGHT / 2
          bestY = shiftedY
        }
      }

      // Ensure within canvas bounds
      bestY = Math.max(CANVAS_MARGIN_Y, Math.min(bestY, canvasHeight - CANVAS_MARGIN_Y - CARD_HEIGHT))

      positions.set(branchId, {
        id: branchId,
        x: columnXs[bestCol] - CARD_WIDTH / 2,
        y: bestY,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      })
    })
  }

  return positions
}

/* ── buildEdgePaths ─────────────────────────────────────────────── */

/**
 * Build SVG path d-strings for every edge.
 *
 * - Main line edges (source.x === target.x) → straight vertical line from
 *   source card bottom to target card top (edge-to-edge).
 * - Branch edges → cubic bezier curve.
 * - Edges with no resolvable position on either end are filtered out.
 * - Converge edges: isConverge is true when the target node is type 'converge'.
 */
export function buildEdgePaths(
  edges: DagEdge[],
  positions: Map<string, NodePosition>,
  nodeMap: Map<string, DagNode>,
): EdgePath[] {
  const out: EdgePath[] = []

  for (const e of edges) {
    const a = positions.get(e.from)
    const b = positions.get(e.to)
    if (!a || !b) continue

    const aCenterX = a.x + a.width / 2
    const aBottomY = a.y + a.height
    const bCenterX = b.x + b.width / 2
    const bTopY = b.y

    let d: string
    if (Math.abs(aCenterX - bCenterX) < 2) {
      // Main line: straight from card bottom to card top (edge-to-edge, visible).
      d = `M ${aCenterX} ${aBottomY} L ${bCenterX} ${bTopY}`
    } else {
      // Branch: cubic bezier from bottom of source to top of target.
      const midY = (aBottomY + bTopY) / 2
      d = `M ${aCenterX} ${aBottomY} C ${aCenterX} ${midY}, ${bCenterX} ${midY}, ${bCenterX} ${bTopY}`
    }

    const targetNode = nodeMap.get(e.to)
    out.push({
      from: e.from,
      to: e.to,
      d,
      dashed: !!e.dashed,
      isConverge: targetNode?.type === 'converge',
    })
  }

  return out
}
