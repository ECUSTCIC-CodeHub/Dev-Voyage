<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { usePageFrontmatter } from '@vuepress/client'

// --- Constants & State ---
const STAGE = {
  IDLE: 'idle',
  IMPLOSION: 'implosion',
  CHAOS: 'chaos',
  EMERGENCE: 'emergence',
  NAVIGATOR: 'navigator'
}

const stage = ref(STAGE.IDLE)
const observerId = ref('0000')
const divergence = ref('1.048596')
const mousePos = ref({ x: 0, y: 0 })
const clickPos = ref({ x: 0, y: 0 })
const typedText = ref('')
const isTypingComplete = ref(false)
const turbulenceFrequency = ref('0.001 0.005')

const activeStructures = ref({
  cnn: false,
  rnn: false,
  transformer: false
})

const fullText = `>_ 认知重构协议 - STANDBY...
>_ SYSTEM: Amadeus Gate v1.048596
>_ OBSERVER: **[等待授权]**
>_ 是否同意授权? [Y/N] Y

>_ **[授权成功]**

>_ 点击任意位置开始...`

const fm = usePageFrontmatter()

interface WorldLine {
  path: string
  type: string
  divergence: string
  title: string
  desc: string
  bgImage?: string
}

const worldLines = computed<WorldLine[]>(() => (fm.value as any).worldLines || [])

// --- Divergence Fluctuation ---
const displayWorldLines = ref<WorldLine[]>([])

watch(worldLines, (newVal) => {
  displayWorldLines.value = JSON.parse(JSON.stringify(newVal))
}, { immediate: true })

const fluctuateDivergence = (baseVal: string) => {
  const parts = baseVal.split('.')
  if (parts.length !== 2) return baseVal
  const decimal = parts[1]
  const prefix = decimal.substring(0, 3)
  const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${parts[0]}.${prefix}${suffix}`
}

let fluctuationInterval: number

// --- Lifecycle ---
onMounted(() => {
  observerId.value = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const visited = localStorage.getItem('amadeus-gate-visited')

  if (visited) {
    stage.value = STAGE.NAVIGATOR
  } else {
    initCRT()
  }

  // Start divergence fluctuation
  fluctuationInterval = window.setInterval(() => {
    divergence.value = fluctuateDivergence('1.048596')
    const rand = Math.random()

    if (rand < 0.955) {
      turbulenceFrequency.value = '0.00001 0.00001'
    } else if (rand < 0.99) {
      const freqX = (0.001 + Math.random() * 0.01).toFixed(4)
      const freqY = (0.01 + Math.random() * 0.5).toFixed(4)
      turbulenceFrequency.value = `${freqX} ${freqY}`
    } else {
      const freqX = (0.0001 + Math.random() * 0.01).toFixed(4)
      const freqY = (0.1 + Math.random() * 0.9).toFixed(4)
      turbulenceFrequency.value = `${freqX} ${freqY}`
    }

    if (displayWorldLines.value.length > 0) {
      displayWorldLines.value.forEach((line, idx) => {
        if (worldLines.value[idx]) {
          line.divergence = fluctuateDivergence(worldLines.value[idx].divergence)
        }
      })
    }
  }, 50)

  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  clearInterval(fluctuationInterval)
  window.removeEventListener('mousemove', handleMouseMove)
})

const handleMouseMove = (e: MouseEvent) => {
  mousePos.value = { x: e.clientX, y: e.clientY }
}

// --- Animation Logic ---
// 1. CRT / Terminal Logic
const initCRT = () => {
  isTypingComplete.value = false
  let i = 0
  const type = () => {
    if (i < fullText.length) {
      typedText.value += fullText.charAt(i)
      i++
      setTimeout(type, Math.random() * 150)
    } else {
      isTypingComplete.value = true
    }
  }
  type()
}

// 2. Protocol Start
const startProtocol = (e: MouseEvent) => {
  clickPos.value = { x: e.clientX, y: e.clientY }
  stage.value = STAGE.IMPLOSION

  setTimeout(() => {
    stage.value = STAGE.CHAOS
    activeStructures.value = { cnn: false, rnn: false, transformer: false }

    setTimeout(() => { activeStructures.value.cnn = true }, 1000)
    setTimeout(() => { activeStructures.value.rnn = true }, 1500)
    setTimeout(() => { activeStructures.value.transformer = true }, 2200)
  }, 800)

  setTimeout(() => {
    stage.value = STAGE.EMERGENCE
  }, 5000)

  setTimeout(() => {
    stage.value = STAGE.NAVIGATOR
    localStorage.setItem('amadeus-gate-visited', 'true')
  }, 8000)
}

const handleTerminalClick = (e: MouseEvent) => {
  if (stage.value === STAGE.IDLE && isTypingComplete.value) {
    startProtocol(e)
  }
}

const handleDoubleClick = () => {
  if (stage.value !== STAGE.NAVIGATOR) {
    stage.value = STAGE.NAVIGATOR
    localStorage.setItem('amadeus-gate-visited', 'true')
  }
}

const handleReplay = () => {
  stage.value = STAGE.IDLE
  typedText.value = ''
  activeStructures.value = { cnn: false, rnn: false, transformer: false }
  initCRT()
}

// Inject worldLines into frontmatter for child components
watch(displayWorldLines, (newVal) => {
  if ((fm.value as any).worldLines) {
    // The child components will read from frontmatter directly
  }
}, { immediate: true })
</script>

<template>
  <div class="amadeus-root" @click="handleTerminalClick" @dblclick="handleDoubleClick">

    <!-- SVG Filters for Real Distortion -->
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">
      <defs>
        <filter id="fisheye-distortion" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" :baseFrequency="turbulenceFrequency" numOctaves="1" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="30" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="card-hover-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.1 1" numOctaves="2" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>

    <!-- CRT / Fisheye Overlay -->
    <div class="fisheye-bulge"></div>
    <div class="crt-overlay">
      <div class="scanlines"></div>
      <div class="vignette"></div>
      <div class="noise"></div>
    </div>

    <!-- STAGE 0: TERMINAL -->
    <transition name="crt-power-off">
      <AmadeusTerminal
        v-if="stage === STAGE.IDLE"
        :typed-text="typedText"
        :is-typing-complete="isTypingComplete"
        @click="handleTerminalClick"
      />
    </transition>

    <!-- STAGE 1: IMPLOSION -->
    <div v-if="stage === STAGE.IMPLOSION" class="implosion-stage">
      <div class="white-hole" :style="{ left: clickPos.x + 'px', top: clickPos.y + 'px' }"></div>
      <div class="full-whiteout"></div>
    </div>

    <!-- STAGE 2: CHAOS -->
    <AmadeusChaos
      v-if="stage === STAGE.CHAOS"
      :active-structures="activeStructures"
    />

    <!-- STAGE 3: EMERGENCE -->
    <AmadeusEmergence v-if="stage === STAGE.EMERGENCE" />

    <!-- STAGE 4: NAVIGATOR -->
    <transition name="fade-up">
      <AmadeusNavigator
        v-if="stage === STAGE.NAVIGATOR"
        :observer-id="observerId"
        :divergence="divergence"
        :mouse-pos="mousePos"
        @replay="handleReplay"
      />
    </transition>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.amadeus-root {
  width: 100vw;
  height: 100vh;
  background: #000;
  color: #0f0;
  font-family: 'Share Tech Mono', monospace;
  overflow: hidden;
  position: relative;
  perspective: 1000px;
  filter: url(#fisheye-distortion) contrast(1.01) brightness(1.1);
  transform: scale(1.02);
}

/* --- CRT EFFECTS --- */
.fisheye-bulge {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10000;
  pointer-events: none;
  box-shadow: inset 0 0 10rem rgba(0,0,0,0.9);
  background: radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(10,10,10,0.5) 90%, rgba(0,0,0,1) 100%);
}

.fisheye-bulge::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  z-index: 2;
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
}

.crt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 1;
}

.scanlines {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0),
    rgba(255,255,255,0) 50%,
    rgba(0,0,0,0.2) 50%,
    rgba(0,0,0,0.2)
  );
  animation: scanline-scroll 10s linear infinite;
}

.vignette {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%);
}

.noise {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  animation: noise-anim 0.5s steps(5) infinite;
}

/* --- STAGE 1: IMPLOSION --- */
.implosion-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
}

.white-hole {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 0;
  height: 0;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 50px #fff, 0 0 100px #fff;
  mix-blend-mode: difference;
  animation: white-hole-expand 0.8s cubic-bezier(0.7, 0, 0.84, 0) forwards;
}

.full-whiteout {
  position: fixed;
  inset: 0;
  background: #fff;
  opacity: 0;
  animation: whiteout-flash 0.1s linear 0.7s forwards;
}

@keyframes white-hole-expand {
  0% { width: 0; height: 0; opacity: 1; }
  50% { width: 100px; height: 100px; opacity: 1; }
  100% { width: 300vmax; height: 300vmax; opacity: 1; }
}

@keyframes whiteout-flash {
  to { opacity: 1; }
}

/* --- ANIMATIONS --- */
@keyframes scanline-scroll {
  0% { background-position: 0 0; background-size: 100% 7px; }
  50% { background-position: 0 50%; background-size: 100% 5px; }
  68% { background-position: 0 68%; background-size: 100% 14px; }
  85% { background-position: 0 85%; background-size: 100% 6px; }
  100% { background-position: 0 100%; background-size: 100% 10px; }
}

@keyframes noise-anim {
  0% { transform: translate(0,0); }
  100% { transform: translate(10px, 10px); }
}

/* Transitions */
.crt-power-off-leave-active {
  transition: all 1.5s cubic-bezier(0.55, 0.055, 0.675, 0.19);
  transform-origin: center center;
}

.crt-power-off-leave-to {
  transform: scale(0) rotate(180deg);
  opacity: 0;
  filter: brightness(5) blur(10px);
}

.fade-up-enter-active {
  transition: all 1s ease-out;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
