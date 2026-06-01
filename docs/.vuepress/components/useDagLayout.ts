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

/** X position for left-side branch nodes. */
const BRANCH_LEFT_X_RATIO = 0.12

/** X position for right-side branch nodes. */
const BRANCH_RIGHT_X_RATIO = 0.78

/** Vertical spacing between sibling branches grouped under the same anchor. */
const BRANCH_Y_SPACING = 200

/** X offset (px) of branch x position from ratio (e.g. 0.12 → ratio * width). */
const RATIO_TO_PX_SCALE = 1

/** Top/bottom margin inside the canvas. */
const CANVAS_MARGIN_Y = 80

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
 *   - Main line: vertical center column, evenly spaced top→bottom
 *   - Branches:   alternating left/right, grouped by the main-line node
 *                they connect from. Branches that share the same parent
 *                are stacked vertically next to that parent.
 *   - Fallback:   branches with no main-line parent are pushed to the
 *                bottom of the canvas, alternating sides.
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

  const mainX = canvasWidth * MAIN_LINE_X_RATIO * RATIO_TO_PX_SCALE
  const leftX = canvasWidth * BRANCH_LEFT_X_RATIO * RATIO_TO_PX_SCALE
  const rightX = canvasWidth * BRANCH_RIGHT_X_RATIO * RATIO_TO_PX_SCALE

  // ── Place the main line first ──
  // Vertical positions: evenly spaced from top margin to bottom margin.
  const mainCount = mainLine.length
  const usableHeight = Math.max(canvasHeight - CANVAS_MARGIN_Y * 2, 0)
  const step = mainCount > 1 ? usableHeight / (mainCount - 1) : 0

  for (let i = 0; i < mainCount; i++) {
    const id = mainLine[i]
    const y = mainCount > 1 ? CANVAS_MARGIN_Y + step * i : canvasHeight / 2
    positions.set(id, {
      id,
      x: mainX - CARD_WIDTH / 2,
      y: y - CARD_HEIGHT / 2,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    })
  }

  // ── Group branches by their connected main-line node ──
  // For each non-main node, find which main-line node it connects to.
  // (Walk the edge list — could be a parent edge, child edge, or both.)
  const mainAnchoredParents = new Map<string, string[]>() // mainId → branchIds

  for (const node of nodes) {
    if (mainLineSet.has(node.id)) continue

    // Find any edge connecting this branch to the main line.
    let anchor: string | undefined
    for (const e of edges) {
      if (e.dashed) continue
      if (e.from === node.id && mainLineSet.has(e.to)) {
        anchor = e.to
        break
      }
      if (e.to === node.id && mainLineSet.has(e.from)) {
        anchor = e.from
        break
      }
    }
    if (anchor) {
      const list = mainAnchoredParents.get(anchor) ?? []
      list.push(node.id)
      mainAnchoredParents.set(anchor, list)
    }
  }

  // ── Place anchored branches ──
  // For each main line node, stack its child branches vertically beside it.
  // Alternate which side a branch goes on to keep balance.
  for (let i = 0; i < mainCount; i++) {
    const mainId = mainLine[i]
    const mainY = (positions.get(mainId)?.y ?? 0) + CARD_HEIGHT / 2
    const children = mainAnchoredParents.get(mainId) ?? []
    if (children.length === 0) continue

    // Try to place roughly centered on the main node, spreading upward/downward.
    const totalHeight = (children.length - 1) * BRANCH_Y_SPACING
    const startY = mainY - totalHeight / 2

    children.forEach((branchId, idx) => {
      // Pick side: alternate, but use main index to keep the layout stable.
      const onLeft = ((i + idx) % 2) === 0
      const x = onLeft ? leftX : rightX
      const y = startY + idx * BRANCH_Y_SPACING
      positions.set(branchId, {
        id: branchId,
        x: x - CARD_WIDTH / 2,
        y: y - CARD_HEIGHT / 2,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      })
    })
  }

  // ── Place unanchored branches at the bottom, alternating sides ──
  const unanchored: DagNode[] = []
  for (const node of nodes) {
    if (mainLineSet.has(node.id)) continue
    if (positions.has(node.id)) continue
    unanchored.push(node)
  }

  let fallbackIdx = 0
  const fallbackY = canvasHeight - CANVAS_MARGIN_Y
  for (const node of unanchored) {
    const onLeft = (fallbackIdx % 2) === 0
    const x = onLeft ? leftX : rightX
    const y = fallbackY - (Math.floor(fallbackIdx / 2) * BRANCH_Y_SPACING)
    positions.set(node.id, {
      id: node.id,
      x: x - CARD_WIDTH / 2,
      y: y - CARD_HEIGHT / 2,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
    })
    fallbackIdx++
  }

  return positions
}

/* ── buildEdgePaths ─────────────────────────────────────────────── */

/**
 * Build SVG path d-strings for every edge.
 *
 * - Main line edges (source.x === target.x) → straight vertical line.
 * - Branch edges                              → cubic bezier curve
 *                                                M x1 y1 C x1 cy1, x2 cy2, x2 y2
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

    // Anchor at the midpoint of each card's edge facing the other.
    const aCenterX = a.x + a.width / 2
    const aCenterY = a.y + a.height / 2
    const bCenterX = b.x + b.width / 2
    const bCenterY = b.y + b.height / 2

    let d: string
    if (aCenterX === bCenterX) {
      // Main line: straight vertical segment between centers.
      d = `M ${aCenterX} ${aCenterY} L ${bCenterX} ${bCenterY}`
    } else {
      // Branch: cubic bezier. Control points share the source/target X
      // and sit at the vertical midpoint, giving a smooth S-curve.
      const cy1 = aCenterY
      const cy2 = bCenterY
      d = `M ${aCenterX} ${aCenterY} C ${aCenterX} ${cy1}, ${bCenterX} ${cy2}, ${bCenterX} ${bCenterY}`
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
