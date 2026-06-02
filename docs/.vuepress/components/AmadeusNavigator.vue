<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { usePageFrontmatter } from '@vuepress/client'
import {
  computePositions,
  buildEdgePaths,
  CARD_WIDTH,
  CARD_HEIGHT,
} from './useDagLayout'
import type { DagNode, DagEdge } from './useDagLayout'

const props = defineProps<{
  observerId: string
  divergence: string
  mousePos: { x: number; y: number }
}>()

const emit = defineEmits<{
  replay: []
}>()

const fm = usePageFrontmatter()
const dagNodes = computed<DagNode[]>(() => (fm.value as any).dag?.nodes || [])
const dagEdges = computed<DagEdge[]>(() => (fm.value as any).dag?.edges || [])
const dagTitle = computed(() => (fm.value as any).dag?.title || 'DAG 导航')

const canvasWidth = ref(3000)
const canvasHeight = ref(5000)
const containerRef = ref<HTMLDivElement>()

const scale = ref(0.3)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })

const filterType = ref<'all' | 'main' | 'branch'>('all')
const showLegend = ref(false)
const tooltip = ref({ visible: false, x: 0, y: 0, label: '', type: '' })

const nodeMap = computed(() => new Map(dagNodes.value.map(n => [n.id, n])))
const positions = computed(() =>
  computePositions(dagNodes.value, dagEdges.value, canvasWidth.value, canvasHeight.value)
)
const edgePaths = computed(() =>
  buildEdgePaths(dagEdges.value, positions.value, nodeMap.value)
)

function isNodeVisible(nodeId: string): boolean {
  if (filterType.value === 'all') return true
  const node = nodeMap.value.get(nodeId)
  if (!node) return false
  if (filterType.value === 'main') return node.type === 'main' || node.type === 'converge'
  return node.type === 'branch' || node.type === 'deadend'
}

function nodeOpacity(nodeId: string): number {
  if (filterType.value === 'all') return 1
  return isNodeVisible(nodeId) ? 1 : 0.08
}

function splitLabel(label: string): string[] {
  return label.split(/\\n/)
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const rect = containerRef.value!.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  const newScale = Math.min(2.0, Math.max(0.2, scale.value * delta))
  const scaleChange = newScale / scale.value
  panX.value = mouseX - (mouseX - panX.value) * scaleChange
  panY.value = mouseY - (mouseY - panY.value) * scaleChange
  scale.value = newScale
}

function onMouseDown(e: MouseEvent) {
  if (e.button !== 0) return
  isPanning.value = true
  panStart.value = { x: e.clientX - panX.value, y: e.clientY - panY.value }
  if (containerRef.value) containerRef.value.style.cursor = 'grabbing'
}

function onMouseMove(e: MouseEvent) {
  if (!isPanning.value) return
  panX.value = e.clientX - panStart.value.x
  panY.value = e.clientY - panStart.value.y
}

function onMouseUp() {
  isPanning.value = false
  if (containerRef.value) containerRef.value.style.cursor = 'grab'
}

function resetView() {
  if (!containerRef.value) return
  scale.value = 0.3
  const pos = positions.value.get('ch0')
  if (pos) {
    const rect = containerRef.value!.getBoundingClientRect()
    panX.value = rect.width / 2 - (pos.x + CARD_WIDTH / 2) * 0.3
    panY.value = rect.height * 0.1
  } else {
    panX.value = 0
    panY.value = 0
  }
}

function fitToScreen() {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const fitScale = Math.min(
    rect.width / canvasWidth.value,
    rect.height / canvasHeight.value,
    1.0
  )
  scale.value = fitScale * 0.85
  panX.value = (rect.width - canvasWidth.value * scale.value) / 2
  panY.value = (rect.height - canvasHeight.value * scale.value) / 2
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'f' || e.key === 'F') { fitToScreen(); return }
  if (e.key === 'r' || e.key === 'R') { resetView(); return }
  if (e.key === '1') { filterType.value = 'main'; return }
  if (e.key === '2') { filterType.value = 'branch'; return }
  if (e.key === '0') { filterType.value = 'all'; return }
}

function onCardEnter(node: DagNode, event: MouseEvent) {
  tooltip.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    label: node.label.replace(/\\n/g, ' · '),
    type: node.type,
  }
}

function onCardLeave() {
  tooltip.value.visible = false
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

watch(positions, (p) => {
  if (p.size > 0) resetView()
}, { once: true })

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div class="navigator-stage">
    <div class="star-bg"></div>
    <AmadeusNeuralBg :mouse-pos="mousePos" />

    <header class="nav-header">
      <a class="brand" href="/">
        <div class="logo-small"></div>
        <div class="text">
          <div class="h1">AMADEUS GATE</div>
          <div class="h2">SYSTEM ONLINE</div>
        </div>
      </a>
      <div class="nav-controls">
        <button class="nav-btn" @click="fitToScreen">[ FIT ]</button>
        <button class="nav-btn" @click="resetView">[ RESET ]</button>
        <button class="nav-btn" @click="showLegend = !showLegend">[ LEGEND ]</button>
        <button class="nav-btn" @click="emit('replay')">[ REPLAY ]</button>
      </div>
      <div class="observer-info">
        <div class="id">OBSERVER: {{ observerId }}</div>
        <div class="div-val">&Delta; {{ divergence }}%</div>
      </div>
    </header>

    <div class="filter-bar">
      <span class="filter-label">DISPLAY:</span>
      <button :class="['filter-btn', { active: filterType === 'all' }]" @click="filterType = 'all'">ALL</button>
      <button :class="['filter-btn', { active: filterType === 'main' }]" @click="filterType = 'main'">GOLDEN PATH</button>
      <button :class="['filter-btn', { active: filterType === 'branch' }]" @click="filterType = 'branch'">BRANCHES</button>
    </div>

    <div class="dag-title">
      <h2>{{ dagTitle }}</h2>
      <p class="dag-subtitle">滚轮缩放 · 拖拽平移 · 点击卡片跳转 · F=全图 R=重置 1/2/0=筛选</p>
    </div>

    <div
      ref="containerRef"
      class="canvas-container"
      @wheel.prevent="onWheel"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    >
      <div v-if="dagNodes.length === 0" class="loading-state">
        <p>>_ Loading DAG data...</p>
      </div>

      <div
        v-else
        class="canvas-content"
        :style="{
          transform: `scale(${scale}) translate(${panX / scale}px, ${panY / scale}px)`,
          width: canvasWidth + 'px',
          height: canvasHeight + 'px',
        }"
      >
        <!-- Layer 1: SVG Edges -->
        <svg
          class="edge-layer"
          :width="canvasWidth"
          :height="canvasHeight"
          :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`"
        >
          <defs>
            <filter id="glow-gold">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-purple">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <marker id="arrow-gold" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ffd700"/>
            </marker>
            <marker id="arrow-orange" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b"/>
            </marker>
            <marker id="arrow-purple" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#c4b5fd"/>
            </marker>
          </defs>

          <g v-for="ep in edgePaths" :key="ep.from + '_' + ep.to">
            <path
              v-if="!ep.dashed && !ep.isConverge"
              :d="ep.d"
              fill="none"
              stroke="#ffd700"
              stroke-width="5"
              filter="url(#glow-gold)"
              :opacity="Math.min(nodeOpacity(ep.from), nodeOpacity(ep.to)) * 0.9"
              marker-end="url(#arrow-gold)"
            />
            <path
              v-else-if="ep.isConverge"
              :d="ep.d"
              fill="none"
              stroke="#c4b5fd"
              stroke-width="2.5"
              filter="url(#glow-purple)"
              :opacity="Math.min(nodeOpacity(ep.from), nodeOpacity(ep.to)) * 0.9"
              marker-end="url(#arrow-purple)"
            />
            <path
              v-else
              :d="ep.d"
              fill="none"
              stroke="#f59e0b"
              stroke-width="1.5"
              stroke-dasharray="8,6"
              :opacity="Math.min(nodeOpacity(ep.from), nodeOpacity(ep.to)) * 0.7"
              marker-end="url(#arrow-orange)"
            />
          </g>
        </svg>

        <!-- Layer 2: Cards -->
        <div
          v-for="node in dagNodes"
          :key="node.id"
          class="card-wrapper"
          :style="{
            position: 'absolute',
            left: (positions.get(node.id)?.x || 0) + 'px',
            top: (positions.get(node.id)?.y || 0) + 'px',
            width: (positions.get(node.id)?.width || CARD_WIDTH) + 'px',
            opacity: nodeOpacity(node.id),
            pointerEvents: isNodeVisible(node.id) ? 'auto' : 'none',
          }"
          @mouseenter="(e) => onCardEnter(node, e)"
          @mouseleave="onCardLeave"
        >
          <AmadeusCard
            v-if="node.path"
            :line="{
              path: node.path,
              type: node.type,
              divergence: '--',
              title: node.label,
              desc: '',
              bgImage: node.bgImage,
            }"
            :index="0"
          />
          <div v-else class="static-card" :class="node.type">
            <div class="static-card-inner">
              <div class="static-type">{{ node.type }}</div>
              <div class="static-label">
                <template v-for="(line, i) in splitLabel(node.label)" :key="i">
                  {{ line }}<br v-if="i < splitLabel(node.label).length - 1"/>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tooltip -->
    <div
      :class="['dag-tooltip', { visible: tooltip.visible }]"
      :style="{ left: tooltip.x + 16 + 'px', top: tooltip.y - 40 + 'px' }"
    >
      <div :class="['tooltip-dot', tooltip.type]"></div>
      <span class="tooltip-title">{{ tooltip.label }}</span>
    </div>

    <!-- Legend -->
    <transition name="fade">
      <div v-if="showLegend" class="legend-overlay" @click.self="showLegend = false">
        <div class="legend-panel">
          <h3>LEGEND</h3>
          <div class="legend-item"><span class="legend-dot main"></span> 主线 (Golden Path)</div>
          <div class="legend-item"><span class="legend-dot branch"></span> 分支链</div>
          <div class="legend-item"><span class="legend-dot converge"></span> 收束点</div>
          <div class="legend-item"><span class="legend-dot deadend"></span> 独立终点</div>
          <hr>
          <div class="legend-item" style="font-size: 11px;">
            滚轮=缩放 | 拖拽=平移 | F=全图 | R=重置 | 1/2/0=筛选
          </div>
          <button class="nav-btn" style="margin-top: 15px; width: 100%;" @click="showLegend = false">[ CLOSE ]</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.navigator-stage {
  --color-main: #ffd700;
  --color-branch: #f59e0b;
  --color-converge: #c4b5fd;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 80;
  display: flex; flex-direction: column;
  overflow: hidden;
}

.star-bg {
  position: fixed;
  width: 100%; height: 100%;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  z-index: -2;
}

/* Header */
.nav-header {
  padding: 12px 40px;
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid rgba(0, 255, 255, 0.15);
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(10px);
  z-index: 10; flex-shrink: 0;
}

.nav-controls { display: flex; gap: 12px; }

.nav-btn {
  color: #0f0; text-decoration: none;
  border: 1px solid #0f0;
  padding: 6px 16px;
  transition: all 0.3s;
  background: rgba(0, 20, 0, 0.4);
  font-size: 0.9rem; letter-spacing: 1px;
  cursor: pointer;
  font-family: 'Share Tech Mono', monospace;
  white-space: nowrap;
}

.nav-btn:hover { background: #0f0; color: #000; box-shadow: 0 0 15px #0f0; }

.brand { display: flex; align-items: center; gap: 16px; text-decoration: none; }
.brand:hover .logo-small { box-shadow: 0 0 15px #0ff, 0 0 30px #0ff; }

.logo-small {
  width: 32px; height: 32px;
  border: 2px solid #0ff; border-radius: 50%;
  box-shadow: 0 0 10px #0ff;
  transition: all 0.3s;
  flex-shrink: 0;
}

.text .h1 { font-size: 1.2rem; color: #fff; font-family: 'Share Tech Mono', monospace; }
.text .h2 { font-size: 0.7rem; color: #0f0; font-family: 'Share Tech Mono', monospace; }

.observer-info { text-align: right; flex-shrink: 0; }
.id { font-size: 0.8rem; color: #0f0; font-family: 'Share Tech Mono', monospace; }
.div-val {
  font-size: 1.3rem; color: #f00;
  text-shadow: 0 0 10px #f00;
  animation: crt-jitter 0.1s infinite;
  font-family: 'Share Tech Mono', monospace;
}

/* Filter bar */
.filter-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 40px;
  background: rgba(0,0,0,0.5);
  border-bottom: 1px solid rgba(0,255,255,0.08);
  z-index: 5; flex-shrink: 0;
}

.filter-label { color: #0f0; font-family: 'Share Tech Mono', monospace; font-size: 0.8rem; opacity: 0.7; }

.filter-btn {
  color: #666; background: transparent;
  border: 1px solid #333;
  padding: 3px 12px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem; cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover { color: #0f0; border-color: #0f0; }
.filter-btn.active { color: var(--color-main); border-color: var(--color-main); background: rgba(255,215,0,0.1); }

/* Title */
.dag-title { text-align: center; padding: 10px 40px 0; flex-shrink: 0; }
.dag-title h2 {
  font-size: 1.3rem; color: #fff; margin: 0;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(0,255,255,0.3);
}
.dag-subtitle { color: #666; font-size: 0.7rem; margin: 4px 0 0; font-family: 'Share Tech Mono', monospace; }

/* Canvas */
.canvas-container {
  flex: 1; width: 100%; min-height: 0;
  position: relative; overflow: hidden;
  cursor: grab;
}

.canvas-content {
  position: absolute; top: 0; left: 0;
  transform-origin: 0 0;
}

.loading-state {
  display: flex; align-items: center; justify-content: center;
  height: 100%;
  color: #0f0; font-family: 'Share Tech Mono', monospace;
}

.edge-layer { position: absolute; top: 0; left: 0; pointer-events: none; }

.card-wrapper { transition: opacity 0.4s ease; }

/* Static card for nodes without path */
.static-card { background: #0a0a0a; border: 1px solid #333; height: 100%; display: flex; align-items: center; justify-content: center; }
.static-card.main { border-color: var(--color-main); border-width: 2px; }
.static-card.branch { border-color: var(--color-branch); border-style: dashed; }
.static-card.converge { border-color: var(--color-converge); border-width: 2px; }
.static-card.deadend { border-color: #16a34a; border-style: dashed; }

.static-card-inner { text-align: center; padding: 8px; }
.static-type { font-size: 9px; color: #666; text-transform: uppercase; font-family: 'Share Tech Mono', monospace; }
.static-label { color: #fff; font-size: 11px; margin-top: 4px; font-family: 'Share Tech Mono', monospace; }

/* Tooltip */
.dag-tooltip {
  position: fixed; pointer-events: none;
  background: rgba(5,5,5,0.95);
  border: 1px solid #0f0;
  padding: 8px 16px; opacity: 0;
  transition: opacity 0.15s;
  z-index: 9999;
  display: flex; align-items: center; gap: 8px;
  white-space: nowrap;
  box-shadow: 0 0 12px rgba(0,255,0,0.2);
}

.dag-tooltip.visible { opacity: 1; }

.tooltip-dot { width: 8px; height: 8px; flex-shrink: 0; }
.tooltip-dot.main { background: var(--color-main); box-shadow: 0 0 8px var(--color-main); }
.tooltip-dot.branch { background: var(--color-branch); }
.tooltip-dot.converge { background: var(--color-converge); box-shadow: 0 0 8px #7c3aed; }
.tooltip-dot.deadend { background: #16a34a; }

.tooltip-title { color: #0f0; font-family: 'Share Tech Mono', monospace; font-size: 12px; }

/* Legend */
.legend-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 9000;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(5px);
}

.legend-panel {
  background: #0a0a1a;
  border: 1px solid #0f0;
  padding: 25px 30px;
  min-width: 350px;
}

.legend-panel h3 {
  color: #0f0; font-family: 'Share Tech Mono', monospace;
  margin: 0 0 15px; font-size: 1.2rem; letter-spacing: 3px;
}

.legend-item {
  color: #ccc; font-family: 'Share Tech Mono', monospace;
  font-size: 13px; margin: 8px 0;
  display: flex; align-items: center; gap: 10px;
}

.legend-dot { width: 12px; height: 12px; border-radius: 3px; flex-shrink: 0; }
.legend-dot.main { background: #1a1a0e; border: 2px solid var(--color-main); }
.legend-dot.branch { background: #2a1a0d; border: 2px dashed var(--color-branch); }
.legend-dot.converge { background: #1a0d2a; border: 3px solid var(--color-converge); }
.legend-dot.deadend { background: #162a0d; border: 2px dashed #16a34a; }

.legend-item hr { width: 100%; border: none; border-top: 1px solid #333; }

/* Animations */
@keyframes crt-jitter {
  0% { transform: translate(0, 0); }
  25% { transform: translate(1px, 0); }
  50% { transform: translate(-1px, 0); }
  75% { transform: translate(0, 1px); }
  100% { transform: translate(0, -1px); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 768px) {
  .nav-header { padding: 10px 15px; flex-wrap: wrap; gap: 8px; }
  .brand { gap: 8px; }
  .text .h1 { font-size: 0.9rem; }
  .nav-btn { font-size: 0.7rem; padding: 4px 10px; }
  .nav-controls { gap: 6px; }
  .filter-bar { padding: 6px 15px; gap: 6px; overflow-x: auto; }
  .dag-title { padding: 8px 15px 0; }
  .dag-title h2 { font-size: 1rem; }
}
</style>
