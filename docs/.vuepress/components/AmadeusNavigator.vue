<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { usePageFrontmatter } from '@vuepress/client'
import { VueFlow } from '@vue-flow/core'
// @vue-flow/core@1.48 仅提供 style.css；theme-default.css 在该版本中不存在，
// 引入会导致 Vite 报 "module not found"。所以只导入官方 style.css。
import '@vue-flow/core/dist/style.css'
import { useLayout } from './useDagLayout'

interface DagNode {
  id: string
  label: string
  type: 'main' | 'branch' | 'converge' | 'deadend'
  path?: string
  bgImage?: string
}

interface DagEdge {
  from: string
  to: string
  dashed?: boolean
}

// 注意：原代码把 defineProps() 的结果赋给未使用的 const props，
// 在 vue-tsc / @typescript-eslint 的 no-unused-vars 规则下会触发警告。
// 这里改为解构占位以消除警告，同时保持 props 类型定义在模板编译时仍可被读取。
const {
  observerId,
  divergence,
  mousePos,
} = defineProps<{
  observerId: string
  divergence: string
  mousePos: { x: number; y: number }
}>()

// 显式引用，避免解构出的变量被严格模式判定为未使用。
void observerId
void divergence
void mousePos

const emit = defineEmits<{
  replay: []
}>()

const fm = usePageFrontmatter()
const dagNodes = computed<DagNode[]>(() => (fm.value as any).dag?.nodes || [])
const dagEdges = computed<DagEdge[]>(() => (fm.value as any).dag?.edges || [])
const dagTitle = computed(() => (fm.value as any).dag?.title || 'DAG 导航')

const { layout } = useLayout()
const vueFlowRef = ref<any>(null)
const containerRef = ref<HTMLDivElement>()

const filterType = ref<'all' | 'main' | 'branch'>('all')
const showLegend = ref(false)

const nodeMap = computed(() => new Map(dagNodes.value.map(n => [n.id, n])))

function isNodeVisible(id: string): boolean {
  if (filterType.value === 'all') return true
  const node = nodeMap.value.get(id)
  if (!node) return false
  if (filterType.value === 'main') return node.type === 'main' || node.type === 'converge'
  return node.type === 'branch' || node.type === 'deadend'
}

function nodeOpacity(id: string): number {
  if (filterType.value === 'all') return 1
  return isNodeVisible(id) ? 1 : 0.06
}

const nodes = ref<any[]>([])
const edges = ref<any[]>([])

// Identify main line node IDs for alignment
function getMainLineIds(): Set<string> {
  const nonDashed = dagEdges.value.filter(e => !e.dashed)
  const children = new Map<string, string[]>()
  const parents = new Map<string, string[]>()
  for (const e of nonDashed) {
    if (!children.has(e.from)) children.set(e.from, [])
    children.get(e.from)!.push(e.to)
    if (!parents.has(e.to)) parents.set(e.to, [])
    parents.get(e.to)!.push(e.from)
  }
  const root = dagNodes.value.find(n => n.type === 'main' && !parents.has(n.id))
  if (!root) return new Set()

  const set = new Set<string>()
  const visited = new Set<string>()
  let cur: string | undefined = root.id
  while (cur && !visited.has(cur)) {
    visited.add(cur)
    set.add(cur)
// 显式声明 next 的类型，避免 noImplicitAny 报错。
// (children.get(cur) || []) 在 TS 中类型为 never[]，需要用 <string[]> 断言才能让 .find 推断出 string。
    const next: string | undefined = (children.get(cur) || [] as string[]).find((id: string) => {
      const node = nodeMap.value.get(id)
      return node && (node.type === 'main' || node.type === 'converge') && !visited.has(id)
    })
    cur = next
  }
  return set
}

function rebuildGraph() {
  const mainLineIds = getMainLineIds()

  nodes.value = dagNodes.value.map(n => ({
    id: n.id,
    type: n.path ? 'amadeus' : 'static',
    position: { x: 0, y: 0 },
    data: { ...n, isMainLine: mainLineIds.has(n.id) },
    style: {
      width: '300px',
      height: '320px',
      opacity: nodeOpacity(n.id),
      transition: 'opacity 0.3s ease',
    },
  }))

  edges.value = dagEdges.value.map(e => {
    const targetNode = nodeMap.value.get(e.to)
    const isConverge = targetNode?.type === 'converge'
    const dashed = e.dashed || false

    let strokeColor: string
    let strokeW: number
    let strokeDash: string

    if (!dashed && !isConverge) {
      strokeColor = '#ffd700'; strokeW = 4; strokeDash = 'none'
    } else if (isConverge) {
      strokeColor = '#c4b5fd'; strokeW = 2.5; strokeDash = 'none'
    } else {
      strokeColor = '#f59e0b'; strokeW = 1.5; strokeDash = '8,6'
    }

    return {
      id: `${e.from}_${e.to}`,
      source: e.from,
      target: e.to,
      type: 'default',
      animated: !dashed,
      style: {
        stroke: strokeColor,
        strokeWidth: strokeW,
        strokeDasharray: strokeDash,
        opacity: Math.min(nodeOpacity(e.from), nodeOpacity(e.to)),
      },
      markerEnd: {
        type: 'arrowclosed',
        color: strokeColor,
        width: 18,
        height: 18,
      },
    }
  })
}

function applyFilter() {
  rebuildGraph()
  nextTick(() => applyLayout())
}

function applyLayout() {
  nodes.value = layout(nodes.value, edges.value, 'TB')

  // Main line X alignment
  const mainLineIds = getMainLineIds()
  const mainNodes = nodes.value.filter(n => mainLineIds.has(n.id))
  if (mainNodes.length > 0) {
    const avgX = mainNodes.reduce((sum, n) => sum + n.position.x, 0) / mainNodes.length
    nodes.value = nodes.value.map(n => {
      if (mainLineIds.has(n.id)) {
        return { ...n, position: { ...n.position, x: avgX } }
      }
      return n
    })
  }

  // 10% zoom, first main node centered
  nextTick(() => {
    const vf = vueFlowRef.value
    if (!vf) return
    const firstMainId = [...mainLineIds][0]
    const firstNode = nodes.value.find(n => n.id === firstMainId || mainLineIds.has(n.id))
    if (firstNode) {
      const nx = firstNode.position.x + 150
      const ny = firstNode.position.y
      const cw = containerRef.value?.clientWidth ?? 1400
      const ch = containerRef.value?.clientHeight ?? 800
      const z = 1.0
      vf.setViewport({ x: -(nx * z) + cw / 2, y: -(ny * z) + ch * 0.3, zoom: z }, { duration: 200 })
    }
  })
}

function fitToScreen() {
  vueFlowRef.value?.fitView({ padding: 0.15, duration: 300 })
}

// 仅在用户未聚焦于可输入元素时，才响应全局快捷键，
// 避免在搜索框 / textarea / contentEditable 中输入 "f"、"1" 等字符时触发筛选/布局。
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  return false
}

// Vue Flow 节点点击：根据节点 data.path 跳转
function onNodeClick(params: { node?: { id: string } }): void {
  const id = params?.node?.id
  if (!id) return
  const p = nodeMap.value.get(id)?.path
  if (p) globalThis.window.location.href = p
}

function onKeyDown(e: KeyboardEvent) {
  if (isEditableTarget(e.target)) return
  if (e.key === 'f' || e.key === 'F') { fitToScreen(); return }
  if (e.key === '1') { filterType.value = 'main'; applyFilter(); return }
  if (e.key === '2') { filterType.value = 'branch'; applyFilter(); return }
  if (e.key === '0') { filterType.value = 'all'; applyFilter(); return }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  rebuildGraph()
  nextTick(() => applyLayout())
})

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
        <button class="nav-btn" @click="fitToScreen()">[ FIT ]</button>
        <button class="nav-btn" @click="applyLayout()">[ LAYOUT ]</button>
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
      <button :class="['filter-btn', { active: filterType === 'all' }]" @click="filterType = 'all'; applyFilter()">ALL</button>
      <button :class="['filter-btn', { active: filterType === 'main' }]" @click="filterType = 'main'; applyFilter()">GOLDEN PATH</button>
      <button :class="['filter-btn', { active: filterType === 'branch' }]" @click="filterType = 'branch'; applyFilter()">BRANCHES</button>
    </div>

    <div class="dag-title">
      <h2>{{ dagTitle }}</h2>
      <p class="dag-subtitle">滚轮缩放 · 拖拽平移 · 点击卡片跳转 · F=全图布局 1/2/0=筛选</p>
    </div>

    <div ref="containerRef" class="flow-container">
      <VueFlow
        ref="vueFlowRef"
        v-if="nodes.length > 0"
        v-model:nodes="nodes"
        v-model:edges="edges"
        :default-viewport="{ zoom: 1.0, x: 200, y: 50 }"
        :min-zoom="0.1"
        :max-zoom="2.5"
        :nodes-draggable="false"
        :edges-updateable="false"
        @node-click="onNodeClick"
      >
        <template #node-amadeus="nodeProps">
          <div
            class="amadeus-node-wrap"
            :style="{ opacity: nodeProps.data.opacity ?? 1, transition: 'opacity 0.3s ease' }"
          >
            <AmadeusCard
              :line="{
                path: nodeProps.data.path,
                type: nodeProps.data.type,
                divergence: '--',
                title: nodeProps.data.label,
                desc: '',
                bgImage: nodeProps.data.bgImage,
              }"
              :index="0"
            />
          </div>
        </template>

        <template #node-static="nodeProps">
          <div
            class="static-card"
            :class="nodeProps.data.type"
            :style="{ opacity: nodeProps.data.opacity ?? 1, transition: 'opacity 0.3s ease' }"
          >
            <div class="static-type">{{ nodeProps.data.type }}</div>
            <div class="static-label">{{ (nodeProps.data.label || '').replace(/\\n/g, ' ') }}</div>
          </div>
        </template>
      </VueFlow>
    </div>

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
            滚轮=缩放 | 拖拽=平移 | 点击卡片=跳转 | F=全图 | 1/2/0=筛选
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

.dag-title { text-align: center; padding: 10px 40px 0; flex-shrink: 0; }
.dag-title h2 {
  font-size: 1.3rem; color: #fff; margin: 0;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 2px;
  text-shadow: 0 0 15px rgba(0,255,255,0.3);
}
.dag-subtitle { color: #666; font-size: 0.7rem; margin: 4px 0 0; font-family: 'Share Tech Mono', monospace; }

.flow-container {
  flex: 1; width: 100%; min-height: 0;
}

/* Let Vue Flow nodes be sized by their content */
.flow-container :deep(.vue-flow__node) {
  width: auto !important;
  height: auto !important;
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
  border-radius: 0 !important;
}

.amadeus-node-wrap {
  width: 300px;
  height: 320px;
  overflow: hidden;
}

.amadeus-node-wrap :deep(.nav-card) {
  width: 100%;
  height: 100%;
}

.flow-container :deep(.vue-flow__background) {
  background: transparent !important;
}

.flow-container :deep(.vue-flow__pane) {
  cursor: grab;
}

.flow-container :deep(.vue-flow__selection) {
  background: rgba(255,215,0,0.08);
  border: 1px solid rgba(255,215,0,0.3);
}

.static-card {
  width: 220px; min-height: 80px;
  background: rgba(10,10,10,0.9);
  border: 1px solid #333;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 12px;
}

.static-card.main { border-color: var(--color-main); border-width: 2px; }
.static-card.branch { border-color: var(--color-branch); border-style: dashed; }
.static-card.converge { border-color: var(--color-converge); border-width: 2px; }
.static-card.deadend { border-color: #16a34a; border-style: dashed; }

.static-type {
  font-size: 9px; color: #666;
  text-transform: uppercase;
  font-family: 'Share Tech Mono', monospace;
  margin-bottom: 4px;
}
.static-label {
  color: #fff; font-size: 12px; text-align: center;
  font-family: 'Share Tech Mono', monospace;
}

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

@keyframes crt-jitter {
  0% { transform: translate(0, 0); }
  25% { transform: translate(1px, 0); }
  50% { transform: translate(-1px, 0); }
  75% { transform: translate(0, 1px); }
  100% { transform: translate(0, -1px); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

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
