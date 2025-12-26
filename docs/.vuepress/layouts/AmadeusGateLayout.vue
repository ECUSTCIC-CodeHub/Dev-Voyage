<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { usePageFrontmatter } from '@vuepress/client'
import { VPLink } from 'vuepress-theme-plume/client'
// --- Constants & State ---
const STAGE = {
  IDLE: 'idle',         // CRT Terminal
  IMPLOSION: 'implosion', // Button click -> Black hole
  CHAOS: 'chaos',       // Data stream, 3D flashes
  EMERGENCE: 'emergence', // Logo formation
  NAVIGATOR: 'navigator' // Final state
}

const stage = ref(STAGE.IDLE)
const observerId = ref('0000')
const divergence = ref('0.000000')
const canvasRef = ref<HTMLCanvasElement | null>(null)
const mousePos = ref({ x: 0, y: 0 })
const clickPos = ref({ x: 0, y: 0 })
const typedText = ref('')
const activeStructures = ref({ cnn: false, rnn: false, transformer: false })
const isTypingComplete = ref(false)

const fullText = `>_ COGNITION RECONSTRUCTION PROTOCOL - STANDBY
>_ SYSTEM: Amadeus Gate v1.048596
>_ OBSERVER: **[WAITING FOR AUTH]**
>_ READY TO INITIATE OBSERVATION? [Y/N] Y
>_ **[AUTHORIZED]**


>_ CLICK ANY WHERE TO BEGIN...`

const fm = usePageFrontmatter()

interface WorldLine {
  path: string
  type: string
  divergence: string
  title: string
  desc: string
}

const worldLines = computed<WorldLine[]>(() => (fm.value as any).worldLines || [])

const STORAGE_KEY = 'amadeus-gate-visited'

// --- Audio Context (Simulated for now) ---
const playSound = (type: 'click' | 'hum' | 'data' | 'ding') => {
  // Placeholder for actual audio implementation
  // In a real app, we'd use AudioContext here
}

// --- Lifecycle ---
onMounted(() => {
  observerId.value = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const visited = localStorage.getItem(STORAGE_KEY)
  
  if (visited) {
    stage.value = STAGE.NAVIGATOR
    initStarfield()
  } else {
    initCRT()
  }


  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
  cancelAnimationFrame(animFrame)
})

const handleMouseMove = (e: MouseEvent) => {
  mousePos.value = { x: e.clientX, y: e.clientY }
}

// --- Animation Logic ---
let animFrame: number

// 1. CRT / Terminal Logic
const initCRT = () => {
  isTypingComplete.value = false
  let i = 0
  const type = () => {
    if (i < fullText.length) {
      typedText.value += fullText.charAt(i)
      i++
      setTimeout(type, Math.random() * 120)
    } else {
      isTypingComplete.value = true
    }
  }
  type()
}

const handleClick = (e: MouseEvent) => {
  if (stage.value === STAGE.IDLE && isTypingComplete.value) {
    startProtocol(e)
  }
}

// 2. Protocol Start
const startProtocol = (e: MouseEvent) => {
  clickPos.value = { x: e.clientX, y: e.clientY }
  playSound('click')
  stage.value = STAGE.IMPLOSION
  
  // Sequence
  setTimeout(() => {
    stage.value = STAGE.CHAOS
    nextTick(() => initChaosCanvas())
    
    // Reset structures
    activeStructures.value = { cnn: false, rnn: false, transformer: false }

    // Schedule flashes (Overlapping)
    // Total Chaos duration is ~4.2s (800ms to 5000ms)
    
    // 1. CNN (Starts at 1.0s, lasts ~1s)
    setTimeout(() => { activeStructures.value.cnn = true }, 1000)
    
    // 2. RNN (Starts at 1.5s, overlaps with CNN fade out)
    setTimeout(() => { activeStructures.value.rnn = true }, 1500)

    // 3. Transformer (Starts at 2.2s, lasts longer)
    setTimeout(() => { activeStructures.value.transformer = true }, 2200)

  }, 800) // Switch to CHAOS while screen is white

  setTimeout(() => {
    stage.value = STAGE.EMERGENCE
    playSound('ding')
  }, 5000)

  setTimeout(() => {
    stage.value = STAGE.NAVIGATOR
    localStorage.setItem(STORAGE_KEY, 'true')
    nextTick(() => initStarfield())
  }, 8000)
}

// 3. Chaos Stage (Canvas)
const initChaosCanvas = () => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')!
  const w = window.innerWidth
  const h = window.innerHeight
  canvasRef.value.width = w
  canvasRef.value.height = h

  const charsCode = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\*&^%$#@!'.split('')
  const charsMath = '∑∫π∞√∆∇∈∉⊂⊃∪∩∧∨¬⇒⇔∀∃'.split('')
  const charsNet = '○●□■△▲◇◆'.split('')

  const drops: { x: number, y: number, speed: number, text: string, color: string }[] = []
  
  for (let i = 0; i < 1400; i++) {
    const type = Math.random()
    let text, color
    if (type < 0.6) { // 60% Code (Green)
       text = charsCode[Math.floor(Math.random() * charsCode.length)]
       color = '#0f0'
    } else if (type < 0.8) { // 20% Math (Blue)
       text = charsMath[Math.floor(Math.random() * charsMath.length)]
       color = '#00f'
    } else { // 20% Net (Cyan)
       text = charsNet[Math.floor(Math.random() * charsNet.length)]
       color = '#0ff'
    }

    drops.push({
      x: Math.random() * w,
      y: Math.random() * h - h,
      speed: 1 + Math.random() * 10, // Faster speed
      text,
      color
    })
  }

  const draw = () => {
    if (stage.value !== STAGE.CHAOS) return
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, w, h)
    
    ctx.font = '15px monospace'

    drops.forEach(drop => {
      ctx.fillStyle = drop.color
      ctx.fillText(drop.text, drop.x, drop.y)
      
      drop.y += drop.speed
      if (drop.y > h) {
        drop.y = -20
        drop.x = Math.random() * w
        // Refresh char
        if (drop.color === '#0f0') drop.text = charsCode[Math.floor(Math.random() * charsCode.length)]
        else if (drop.color === '#00f') drop.text = charsMath[Math.floor(Math.random() * charsMath.length)]
        else drop.text = charsNet[Math.floor(Math.random() * charsNet.length)]
      }
    })

    animFrame = requestAnimationFrame(draw)
  }
  draw()
}

// 4. Starfield (Navigator Background)
const initStarfield = () => {
  // Simple CSS or Canvas starfield can be implemented here if needed
  // For now, we use CSS background
}

const handleDoubleClick = () => {
  if (stage.value !== STAGE.NAVIGATOR) {
    stage.value = STAGE.NAVIGATOR
    localStorage.setItem(STORAGE_KEY, 'true')
  }
}

const replay = () => {
  stage.value = STAGE.IDLE
  typedText.value = ''
  activeStructures.value = { cnn: false, rnn: false, transformer: false }
  initCRT()
}
</script>

<template>
  <div class="amadeus-root" @click="handleClick" @dblclick="handleDoubleClick">
    
    <!-- CRT Overlay (Always present but varies in intensity) -->
    <div class="crt-overlay" :class="{ 'off': stage === STAGE.NAVIGATOR }">
      <div class="scanlines"></div>
      <div class="vignette"></div>
      <div class="noise"></div>
    </div>

    <!-- STAGE 0: TERMINAL (CRT) -->
    <transition name="crt-power-off">
      <div v-if="stage === STAGE.IDLE" class="terminal-container">
        <div class="screen-curvature">
          <div class="terminal-content">
            <div class="header">
              {{ typedText }}<span class="cursor-blink">_</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- STAGE 1: IMPLOSION -->
    <div v-if="stage === STAGE.IMPLOSION" class="implosion-stage">
      <div class="white-hole" :style="{ left: clickPos.x + 'px', top: clickPos.y + 'px' }"></div>
      <div class="full-whiteout"></div>
    </div>

    <!-- STAGE 2: CHAOS (Data Stream + 3D Objects) -->
    <div v-if="stage === STAGE.CHAOS" class="chaos-stage">
      <div class="white-fade-out"></div>
      <canvas ref="canvasRef" class="matrix-canvas"></canvas>
      
      <!-- Flashing Structures Container -->
      <div class="structures-container">
        
        <!-- CNN: Grid Scan -->
        <div v-if="activeStructures.cnn" class="structure-cnn">
           <div class="cnn-grid">
             <div v-for="n in 9" :key="n" class="cnn-cell"></div>
             <div class="cnn-kernel"></div>
           </div>
           <div class="label">CONVOLUTION</div>
        </div>

        <!-- RNN: Looping Chain -->
        <div v-if="activeStructures.rnn" class="structure-rnn">
           <div class="rnn-nodes">
             <div class="rnn-node">h-1</div>
             <div class="rnn-arrow">→</div>
             <div class="rnn-node active">h0</div>
             <div class="rnn-arrow">→</div>
             <div class="rnn-node">h1</div>
           </div>
           <div class="rnn-loop">↻</div>
           <div class="label">RECURRENT</div>
        </div>

        <!-- Transformer: Attention Matrix -->
        <div v-if="activeStructures.transformer" class="structure-transformer">
           <div class="attention-rays">
             <div v-for="n in 20" :key="n" class="ray" :style="{ '--i': n }"></div>
           </div>
           <div class="matrix-core">ATTENTION</div>
        </div>

      </div>

      <!-- Flashing Structures -->
      <div class="flash-overlay"></div>
    </div>

    <!-- STAGE 3: EMERGENCE (Logo) -->
    <div v-if="stage === STAGE.EMERGENCE" class="emergence-stage">
      <div class="white-flash"></div>
      <div class="logo-construct">
        <div class="ring ring-1"></div>
        <div class="ring ring-2"></div>
        <div class="ring ring-3"></div>
        <div class="core-eye"></div>
      </div>
      <div class="title-construct">
        <h1 class="main-title">AMADEUS GATE</h1>
        <div class="sub-title">AI COGNITION RECONSTRUCTION PROTOCOL</div>
        <div class="divergence-readout">
          WORLD LINE DIVERGENCE: <span class="red">0.000000%</span> -> [READY]
        </div>
      </div>
    </div>

    <!-- STAGE 4: NAVIGATOR (Final) -->
    <transition name="fade-up">
      <div v-if="stage === STAGE.NAVIGATOR" class="navigator-stage">
        <div class="star-bg"></div>
        
        <header class="nav-header">
          <div class="brand">
            <div class="logo-small"></div>
            <div class="text">
              <div class="h1">AMADEUS GATE</div>
              <div class="h2">SYSTEM ONLINE</div>
            </div>
          </div>

          <div class="nav-controls">
            <button class="nav-btn" @click="replay">[ REPLAY ]</button>
            <VPLink href="/" class="nav-btn">[ RETURN ]</VPLink>
          </div>

          <div class="observer-info">
            <div class="id">OBSERVER: {{ observerId }}</div>
            <div class="div-val">∆ {{ divergence }}%</div>
          </div>
        </header>

        <main class="nav-grid">
          <div class="nav-grid-header">
            <h1 class="nav-grid-title">混沌与涌现：AI时间线操纵指南</h1>
            <p class="nav-grid-subtitle">一切都是石头门的选择！ ————用最不正经的方式，学最正经的AI</p>
          </div>
          <div class="nav-card-wrapper">
            <VPLink 
              v-for="(line, index) in worldLines" 
              :key="line.path" 
              :href="line.path"
              class="nav-card"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="card-3d-wrapper">
                <div class="card-face">
                  <div class="card-bg"></div>
                  <div class="card-content">
                    <div class="card-top">
                      <span class="type">{{ line.type }}</span>
                      <span class="div-rate">{{ line.divergence }}%</span>
                    </div>
                    <div class="card-mid">
                      <h3>{{ line.title }}</h3>
                      <p>{{ line.desc }}</p>
                    </div>
                    <div class="card-bot">
                      <span class="jump-cmd">>> JUMP</span>
                    </div>
                  </div>
                  <div class="card-scanline"></div>
                </div>
              </div>
            </VPLink>
          </div>
        </main>
      </div>
    </transition>

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

/* --- GLOBAL --- */
.amadeus-root {
  width: 100vw;
  height: 100vh;
  background: #000;
  color: #0f0;
  font-family: 'Share Tech Mono', monospace;
  overflow: hidden;
  position: relative;
  perspective: 1000px; /* For 3D effects */
}

/* --- CRT EFFECTS --- */
.crt-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  transition: opacity 2s;
}

.crt-overlay.off {
  opacity: 0.1; /* Keep a subtle effect even in navigator */
}

.scanlines {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0),
    rgba(255,255,255,0) 50%,
    rgba(0,0,0,0.6) 50%,
    rgba(0,0,0,0.6)
  );
  animation: scanline-scroll 10s linear infinite;
}

.vignette {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.8) 100%);
}

.noise {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
  animation: noise-anim 0.5s steps(5) infinite;
}

/* --- STAGE 0: TERMINAL --- */
.terminal-container {
  width: 40%;
  height: 40%;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  align-items: center;
  background: #050505;
}

@media (max-width: 1400px) {
  .terminal-container {
    width: 60%;
    height: 60%;
  }
}

@media (max-width: 768px) {
  .terminal-container {
    width: 95%;
    height: 40%;
  }
}

.screen-curvature {
  width: 90%;
  height: 90%;
  bottom: 5%;
  /* Light leak effect: Gradient from bottom-right */
  background: #1f4f1f90;
  border: 2px solid #0f0;
  border-radius: 10px;
  box-shadow: 0 0 40px rgba(0, 255, 0, 0.6), inset 0 0 40px rgba(0, 255, 0, 0.3);
  padding: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  overflow: hidden;
}

@media (max-width: 768px) {
  .screen-curvature {
    padding: 20px;
  }
}

.terminal-content {
  color: #0f0;
  text-shadow: 2px 0 1px rgba(0,255,0,0.5), -2px 0 1px rgba(0,255,0,0.3);
  font-size: 1.2rem;
  line-height: 1.6;
  white-space: pre-wrap;
  text-align: left;
  width: 100%;
  animation: text-distortion 3s infinite;
}

@media (max-width: 768px) {
  .terminal-content {
    font-size: 1.2rem;
    line-height: 1.4;
  }
}

.cursor-blink {
  animation: blink 1s step-end infinite;
  display: inline-block;
  vertical-align: bottom;
}

.start-btn {
  margin-top: 40px;
  background: transparent;
  border: none;
  color: #0f0;
  padding: 10px 20px;
  font-family: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.1s;
  text-transform: uppercase;
  letter-spacing: 2px;
}
@media (max-width: 786px) {
  .start-btn {
    font-size: 1rem;
    padding: 8px 16px;
  }
    
}

.start-btn:hover {
  background: #0f0;
  color: #000;
  box-shadow: 0 0 20px #0f0;
}

/* --- STAGE 1: IMPLOSION --- */
.implosion-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999; /* Topmost */
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
  /* Distortion effect using mix-blend-mode to invert/distort underlying terminal */
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
  50% { width: 100px; height: 100px; opacity: 1; } /* Initial pop */
  100% { width: 300vmax; height: 300vmax; opacity: 1; } /* Consume everything */
}

@keyframes whiteout-flash {
  to { opacity: 1; }
}

/* --- STAGE 2: CHAOS --- */
.chaos-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 90;
  overflow: hidden;
}

.white-fade-out {
  position: absolute;
  inset: 0;
  background: #fff;
  z-index: 200;
  animation: fade-out-white 2s ease-out forwards;
  pointer-events: none;
}

@keyframes fade-out-white {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

.structures-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 150;
  pointer-events: none;
  display: grid;
  place-items: center;
}

.structures-container > * {
  grid-area: 1 / 1;
}

/* CNN Structure */
.structure-cnn {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: flash-cycle 1.2s ease-out forwards;
  transform: scale(4); /* Make it huge */
}

.cnn-grid {
  display: grid;
  grid-template-columns: repeat(3, 50px);
  grid-template-rows: repeat(3, 50px);
  gap: 5px;
  position: relative;
}

.cnn-cell {
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #0ff;
}

.cnn-kernel {
  position: absolute;
  width: 105px; /* 2 cells + gap */
  height: 105px;
  border: 2px solid #fff;
  box-shadow: 0 0 15px #fff;
  top: 0;
  left: 0;
  animation: kernel-scan 0.2s linear infinite;
}

@keyframes kernel-scan {
  0% { transform: translate(0, 0); }
  25% { transform: translate(55px, 0); }
  50% { transform: translate(55px, 55px); }
  75% { transform: translate(0, 55px); }
  100% { transform: translate(0, 0); }
}

/* RNN Structure */
.structure-rnn {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: flash-cycle 1.2s ease-out forwards;
  transform: scale(4); /* Make it huge */
}

.rnn-nodes {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  color: #0ff;
}

.rnn-node {
  width: 50px;
  height: 50px;
  border: 2px solid #0ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.rnn-node.active {
  background: #0ff;
  color: #000;
  box-shadow: 0 0 20px #0ff;
}

.rnn-loop {
  font-size: 40px;
  color: #fff;
  margin-top: -10px;
  animation: spin 1s linear infinite;
}

/* Transformer Structure */
.structure-transformer {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 500px;
  animation: flash-cycle-long 2s ease-out forwards;
  transform: scale(3); /* Make it huge */
}

.attention-rays {
  position: absolute;
  transform-style: preserve-3d;
  animation: rotate-3d 2s linear infinite;
}

.ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 150px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #0ff, #fff);
  transform-origin: 0 0;
  transform: rotateY(calc(var(--i) * 18deg)) rotateZ(45deg);
}

.matrix-core {
  position: absolute;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 0 10px #0ff;
  z-index: 10;
}

.label {
  margin-top: 10px;
  color: #fff;
  font-size: 20px;
  letter-spacing: 2px;
  text-shadow: 0 0 5px #fff;
}

@keyframes flash-cycle {
  0% { opacity: 0; transform: scale(3); } /* Start big */
  10% { opacity: 1; transform: scale(4); } /* Flash bigger */
  50% { opacity: 1; transform: scale(4); }   /* Freeze for ~0.5s (40% of 1.2s) */
  100% { opacity: 0; transform: scale(5); filter: blur(4px); } /* Melt huge */
}

@keyframes flash-cycle-long {
  0% { opacity: 0; transform: scale(2); }
  10% { opacity: 1; transform: scale(3); } /* Flash */
  60% { opacity: 1; transform: scale(3); }   /* Freeze longer (~1s) */
  100% { opacity: 0; transform: scale(4); filter: blur(4px); } /* Melt */
}

@keyframes rotate-3d {
  0% { transform: rotateX(0) rotateY(0); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.matrix-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

/* CSS 3D Transformer Cube */
.transformer-scene {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  perspective: 600px;
  transform: translate(-50%, -50%);
}

.cube {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: rotate-cube 5s linear infinite;
}

.face {
  position: absolute;
  width: 200px;
  height: 200px;
  border: 2px solid rgba(0, 255, 255, 0.5);
  background: rgba(0, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #fff;
  text-shadow: 0 0 10px #0ff;
}

.front  { transform: rotateY(0deg) translateZ(100px); }
.back   { transform: rotateY(180deg) translateZ(100px); }
.right  { transform: rotateY(90deg) translateZ(100px); }
.left   { transform: rotateY(-90deg) translateZ(100px); }
.top    { transform: rotateX(90deg) translateZ(100px); }
.bottom { transform: rotateX(-90deg) translateZ(100px); }

/* --- STAGE 3: EMERGENCE --- */
.emergence-stage {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 95;
  background: #000;
}

.white-flash {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  animation: flash-fade 0.5s forwards;
}

.logo-construct {
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 40px;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid #0ff;
  border-radius: 50%;
}

.ring-1 { width: 100%; height: 100%; animation: spin 10s linear infinite; border-style: dashed; }
.ring-2 { width: 70%; height: 70%; animation: spin 5s linear reverse infinite; border-color: #0f0; }
.ring-3 { width: 40%; height: 40%; animation: pulse 2s infinite; background: rgba(0, 255, 255, 0.2); }

.title-construct {
  text-align: center;
  animation: slide-up 1s ease-out;
}

.main-title {
  font-size: 4rem;
  color: #fff;
  text-shadow: 0 0 20px #0ff;
  margin: 0;
  letter-spacing: 10px;
}

.sub-title {
  color: #888;
  letter-spacing: 5px;
  margin-top: 10px;
}

.divergence-readout {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #0f0;
}

.red { color: #f00; text-shadow: 0 0 10px #f00; }

/* --- STAGE 4: NAVIGATOR --- */
.navigator-stage {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #020205;
  z-index: 80;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.star-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  z-index: -1;
}

.nav-header {
  padding: 30px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
}

.nav-controls {
  display: flex;
  gap: 20px;
}

.nav-btn {
  color: #0f0;
  text-decoration: none;
  border: 1px solid #0f0;
  padding: 8px 20px;
  transition: all 0.3s;
  background: rgba(0, 20, 0, 0.5);
  font-size: 1.2rem;
  letter-spacing: 2px;
  cursor: pointer;
  font-family: inherit;
}

.nav-btn:hover {
  background: #0f0;
  color: #000;
  box-shadow: 0 0 15px #0f0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-small {
  width: 40px;
  height: 40px;
  border: 2px solid #0ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #0ff;
}

.text .h1 { font-size: 1.5rem; color: #fff; }
.text .h2 { font-size: 0.8rem; color: #0f0; }

.observer-info {
  text-align: right;
}

.nav-grid {
  flex: 1;
  padding: 50px;
  display: flex;
  flex-direction: column;
  perspective: 1000px;
  overflow-y: auto;
  overflow-x: hidden;
}

.div-val {
  font-size: 1.5rem;
  color: #f00;
  text-shadow: 0 0 10px #f00;
}

.nav-grid-header {
  margin-bottom: 40px;
  text-align: center;
  animation: fade-up 0.8s ease-out;
}

.nav-grid-title {
  font-size: 2.5rem;
  color: #fff;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  margin: 0 0 15px 0;
  letter-spacing: 3px;
}

.nav-grid-subtitle {
  color: #0f0;
  font-size: 1.1rem;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.nav-card-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  perspective: 1000px;
}

.nav-card {
  text-decoration: none;
  height: 250px;
  transform-style: preserve-3d;
  transition: transform 0.5s;
  animation: card-enter 0.8s backwards;
}

.nav-card:hover {
  transform: translateZ(20px) rotateX(5deg);
}

.card-3d-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

.card-face {
  width: 100%;
  height: 100%;
  background: rgba(0, 20, 40, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.3);
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
  transition: all 0.3s;
}

.nav-card:hover .card-face {
  border-color: #0ff;
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
  background: rgba(0, 30, 60, 0.9);
}

.card-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #888;
}

.card-mid h3 {
  font-size: 2rem;
  color: #fff;
  margin: 0 0 10px 0;
}

.card-mid p {
  color: #aaa;
  font-size: 0.9rem;
}

.jump-cmd {
  color: #0f0;
  font-weight: bold;
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.3s;
  display: inline-block;
}

.nav-card:hover .jump-cmd {
  opacity: 1;
  transform: translateX(0);
}

.card-scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #0ff;
  opacity: 0.5;
  animation: scan 2s linear infinite;
  display: none;
}

.nav-card:hover .card-scanline {
  display: block;
}

/* --- ANIMATIONS --- */
@keyframes crt-jitter {
  0% { transform: translate(0, 0); }
  25% { transform: translate(1px, 0); }
  50% { transform: translate(-1px, 0); }
  75% { transform: translate(0, 1px); }
  100% { transform: translate(0, -1px); }
}

@keyframes text-distortion {
  0% { transform: skewX(0deg); }
  2% { transform: skewX(2deg); filter: blur(0.5px); }
  4% { transform: skewX(-2deg); filter: blur(0px); }
  6% { transform: skewX(0deg); }
  100% { transform: skewX(0deg); }
}

@keyframes text-reveal {
  0% { clip-path: circle(0% at 100% 100%); }
  100% { clip-path: circle(150% at 100% 100%); }
}

@keyframes scanline-scroll {
  0% { background-position: 0 0; background-size: 100% 3px; }
  100% { background-position: 0 100%;   background-size: 100% 5px; }
}

@keyframes noise-anim {
  0% { transform: translate(0,0); }
  100% { transform: translate(10px, 10px); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes glitch-slide {
  0% { left: -100%; }
  50% { left: 200%; }
  100% { left: 200%; }
}

@keyframes implode-ring {
  0% { transform: scale(0); opacity: 0; border-width: 1px; }
  50% { transform: scale(50); opacity: 1; border-width: 20px; }
  100% { transform: scale(0); opacity: 0; border-width: 0; }
}

@keyframes rotate-cube {
  0% { transform: rotateX(0) rotateY(0); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
}

@keyframes spin {
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes flash-fade {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes slide-up {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes card-enter {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
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
