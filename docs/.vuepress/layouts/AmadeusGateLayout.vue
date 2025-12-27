<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
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
const neuralCanvasRef = ref<HTMLCanvasElement | null>(null)
const mousePos = ref({ x: 0, y: 0 })
const clickPos = ref({ x: 0, y: 0 })
const typedText = ref('')
const activeStructures = ref({ cnn: false, rnn: false, transformer: false })
const isTypingComplete = ref(false)
const turbulenceFrequency = ref('0.001 0.005')

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

// --- Divergence Fluctuation Logic ---
const displayWorldLines = ref<WorldLine[]>([])

watch(worldLines, (newVal) => {
  displayWorldLines.value = JSON.parse(JSON.stringify(newVal))
}, { immediate: true })

const fluctuateDivergence = (baseVal: string) => {
  const parts = baseVal.split('.')
  if (parts.length !== 2) return baseVal
  const decimal = parts[1]
  // Keep first 3 digits stable, fluctuate last 3
  const prefix = decimal.substring(0, 3)
  const suffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${parts[0]}.${prefix}${suffix}`
}

let fluctuationInterval: number

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
    nextTick(() => initNeuralBg())
  } else {
    initCRT()
  }

  // Start divergence fluctuation
  fluctuationInterval = window.setInterval(() => {
    // Fluctuate global divergence
    divergence.value = fluctuateDivergence('1.048596')
    const rand = Math.random()
    // Fluctuate distortion frequency (Dynamic Fisheye)
    if ( rand < 0.93) {
      // X: Low freq (0.001 - 0.021) for large waves
      // Y: Low freq (0.01 - 0.2) for subtle vertical distortion
      const freqX = (0.00001 + Math.random() * 0.00001)
      const freqY = (0.00001 + Math.random() * 0.00009)
      turbulenceFrequency.value = `${freqX} ${freqY}`
    } else if (rand > 0.93 && rand < 0.99) {
      const freqX = (0.001 + Math.random() * 0.01).toFixed(4)
      const freqY = (0.01 + Math.random() * 0.1).toFixed(4)
      turbulenceFrequency.value = `${freqX} ${freqY}`
    }
    else if (rand > 0.99) {
      const freqX = (0.0001 + Math.random() * 0.01).toFixed(4)
      const freqY = (0.1 + Math.random() * 0.9).toFixed(4)
      turbulenceFrequency.value = `${freqX} ${freqY}`
    }
    // Fluctuate world lines
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
    nextTick(() => {
      initStarfield()
      initNeuralBg()
    })
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
  
  // Dynamic drop count based on screen width
  const dropCount = w < 768 ? 400 : 1400

  for (let i = 0; i < dropCount; i++) {
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

// 5. Neural Network Background
const initNeuralBg = () => {
  if (!neuralCanvasRef.value) return
  const ctx = neuralCanvasRef.value.getContext('2d')!
  const w = window.innerWidth
  const h = window.innerHeight
  neuralCanvasRef.value.width = w
  neuralCanvasRef.value.height = h

  const nodes: { x: number, y: number, vx: number, vy: number }[] = []
  const nodeCount = w < 768 ? 100 : 1000
  const connectionDistance = 150

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    })
  }

  const draw = () => {
    if (stage.value !== STAGE.NAVIGATOR) return
    ctx.clearRect(0, 0, w, h)
    
    // Update and draw nodes
    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
    nodes.forEach(node => {
      node.x += node.vx
      node.y += node.vy

      if (node.x < 0 || node.x > w) node.vx *= -1
      if (node.y < 0 || node.y > h) node.vy *= -1

      ctx.beginPath()
      ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw connections
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < connectionDistance) {
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }
    }

    // Mouse interaction
    const mouseDist = 200
    nodes.forEach(node => {
      const dx = mousePos.value.x - node.x
      const dy = mousePos.value.y - node.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < mouseDist) {
        ctx.beginPath()
        ctx.moveTo(mousePos.value.x, mousePos.value.y)
        ctx.lineTo(node.x, node.y)
        ctx.strokeStyle = `rgba(0, 255, 0, ${1 - dist / mouseDist})`
        ctx.stroke()
        
        // Slight attraction
        node.x += dx * 0.0002
        node.y += dy * 0.0002
      }
    })

    requestAnimationFrame(draw)
  }
  draw()
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
    
    <!-- SVG Filters for Real Distortion -->
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">
      <defs>
        <filter id="fisheye-distortion" x="-20%" y="-20%" width="140%" height="140%">
          <!-- 1. Large wave turbulence for "glass warp" -->
          <feTurbulence type="fractalNoise" :baseFrequency="turbulenceFrequency" numOctaves="1" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="30" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="card-hover-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.51" numOctaves="2" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="20" xChannelSelector="R" yChannelSelector="G" />
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
        <canvas ref="neuralCanvasRef" class="neural-bg"></canvas>
        
        <div class="nav-container">
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
                v-for="(line, index) in displayWorldLines" 
                :key="line.path" 
                :href="line.path"
                class="nav-card"
                :style="{ animationDelay: `${index * 0.1}s` }"
              >
                <div class="card-3d-wrapper">
                  <div class="card-face">
                    <div class="card-bg-container">
                      <div class="card-bg" :style="{ backgroundImage: `url(${line.bgImage || 'https://picsum.photos/seed/amadeus/600/400'})` }"></div>
                    </div>
                    <div class="card-content">
                      <!-- HUD Header -->
                      <div class="hud-header">
                        <div class="type-badge">{{ line.type }}</div>
                        <div class="div-meter">
                          <span class="label">DIV:</span>
                          <span class="value">{{ line.divergence }}%</span>
                        </div>
                      </div>

                      <!-- Main Body -->
                      <div class="hud-body">
                        <h3 class="glitch-title" :data-text="line.title">{{ line.title }}</h3>
                        <div class="deco-line"></div>
                        <p class="desc">{{ line.desc }}</p>
                      </div>

                      <!-- HUD Footer -->
                      <div class="hud-footer">
                        <div class="status-indicator">
                          <span class="dot"></span>
                          <span class="text">ONLINE</span>
                        </div>
                        <span class="jump-cmd">INITIALIZE >></span>
                      </div>
                    </div>
                  </div>
                </div>
              </VPLink>
            </div>
          </main>
        </div>
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
  /* Apply the SVG distortion filter */
  filter: url(#fisheye-distortion) contrast(1.01) brightness(1.1);
  /* Slight zoom to cover filter edges */
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
  /* The Bulge Illusion: Thick curved borders + Inset Shadow */
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
  /* Always visible now */
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
  text-align: center;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
    letter-spacing: 5px;
  }
  
  .sub-title {
    font-size: 0.9rem;
    letter-spacing: 2px;
    padding: 0 20px;
  }
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
  overflow-y: auto; /* Allow scrolling on the stage itself */
  overflow-x: hidden;
}

.neural-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.nav-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.star-bg {
  position: fixed; /* Fixed to stay behind scroll */
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  z-index: -2;
}

.nav-header {
  padding: 30px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
  width: 100%;
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
  /* Removed overflow properties as they are now on the stage */
}

.div-val {
  font-size: 1.5rem;
  color: #f00;
  text-shadow: 0 0 10px #f00;
  /* Jitter animation for the main divergence number */
  animation: crt-jitter 0.1s infinite;
}

.nav-grid-header {
  margin-bottom: 40px;
  text-align: center;
  animation: fade-up 0.8s ease-out;
}

.nav-grid-title {
  font-size: 2.5rem;
  font-weight: bolder;
  color: #fff;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
  margin: 0 0 15px 0;
  letter-spacing: 3px;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.nav-grid-subtitle {
  color: #0f0;
  font-size: 1.1rem;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.nav-card-wrapper {
  display: grid;
  /* Force 4 columns on large screens */
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

@media (max-width: 1200px) {
  .nav-card-wrapper {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .nav-card-wrapper {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .nav-card-wrapper {
    grid-template-columns: 1fr;
  }
}

.nav-card {
  text-decoration: none;
  height: 280px;
  position: relative;
  transition: all 0.3s;
  animation: card-enter 0.8s backwards;
  background: #000;
  /* Retro Terminal Style: Simple border, no sci-fi clips */
  border: 2px solid #0f0;
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.2);
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
  border-color: #fff;
  /* High intensity distortion on hover */
  filter: url(#card-hover-distortion);
}

/* Remove old pseudo-elements */
.nav-card::before, .nav-card::after { display: none; }

.card-3d-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  padding: 4px; /* Inner padding for double border effect */
}

.card-face {
  width: 100%;
  height: 100%;
  background: #050505;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(0, 255, 0, 0.3); /* Inner thin border */
}


/* --- NEW HUD CONTENT STYLES --- */
.card-content {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Hover effect: Jitter the content too */
.nav-card:hover .card-content {
  animation: crt-jitter 0.2s infinite;
}

/* Header */
.hud-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed rgba(0, 255, 0, 0.4);
  padding-bottom: 8px;
  margin-bottom: 10px;
}

.type-badge {
  background: #000;
  border: 1px solid #0f0;
  color: #0f0;
  padding: 2px 6px;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.div-meter {
  font-family: monospace;
  font-size: 0.8rem;
}

.div-meter .label { color: #0f0; margin-right: 5px; }
.div-meter .value { 
  color: #f00; 
  text-shadow: 0 0 5px #f00;
  display: inline-block;
}

/* Hover effect: Crazy jump for the number */
.nav-card:hover .div-meter .value {
  animation: crt-jitter 0.05s infinite;
  color: #fff;
  text-shadow: 2px 0 #f00, -2px 0 #00f;
}

/* Body */
.hud-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.glitch-title {
  font-size: 1.6rem;
  color: #0f0;
  margin: 0 0 10px 0;
  position: relative;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
  text-transform: uppercase;
}

.nav-card:hover .glitch-title {
  color: #fff;
  text-shadow: 2px 0 #f00, -2px 0 #00f;
}

.deco-line {
  display: none; /* Remove decorative line for retro feel */
}

.desc {
  color: #0f0;
  font-size: 0.9rem;
  line-height: 1.4;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: 'Courier New', Courier, monospace; /* More retro font */
}

/* Footer */
.hud-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed rgba(0, 255, 0, 0.4);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-indicator .dot {
  width: 8px;
  height: 8px;
  background: #0f0;
  border-radius: 0; /* Square dot */
  animation: blink 1s steps(2) infinite; /* Digital blink */
}

.status-indicator .text {
  font-size: 0.7rem;
  color: #0f0;
}

.jump-cmd {
  color: #0f0;
  font-weight: bold;
  font-size: 0.9rem;
  background: #000;
  padding: 2px 5px;
  border: 1px solid transparent;
}

.nav-card:hover .jump-cmd {
  background: #0f0;
  color: #000;
  border-color: #0f0;
  animation: blink 2s  infinite;
}

/* Hide Decorative Corners */
.corner { display: none; }

.card-bg-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  transition: opacity 0.3s;
  /* Retro B&W */
  filter: grayscale(100%) contrast(2) brightness(0.6) sepia(100%) hue-rotate(50deg) saturate(3); /* Green tint */
  /* No animation by default */
}

/* Scanline texture overlay for the image */
.card-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.5) 1px,
    transparent 1px,
    transparent 2px
  );
  background-size: 100% 8px;
  pointer-events: none;
}


.nav-card:hover .card-bg {
  opacity: 1;
  /* Hover: Crazy distortion */
  animation: crt-distortion 0.1s infinite; /* Very fast jitter */
  /* Highlight: Restore color, boost brightness, remove retro tint */
  filter: grayscale(0%) contrast(1.1) brightness(1.2) sepia(0%);
}

/* Removed .card-bg:hover as it is covered by content and overridden by animation */

@keyframes crt-distortion {
  0% { transform: translate(0, 0) skewX(0deg) scale(1.1); }
  25% { transform: translate(-5px, 2px) skewX(5deg) scale(1.1); }
  50% { transform: translate(5px, -2px) skewX(-5deg) scale(1.1); }
  75% { transform: translate(-2px, 5px) skewX(2deg) scale(1.1); }
  100% { transform: translate(2px, -5px) skewX(-2deg) scale(1.1); }
}

/* --- MOBILE ADAPTATION --- */
@media (max-width: 768px) {
  /* Nav Header */
  .nav-header {
    padding: 15px 20px;
    flex-direction: column;
    gap: 15px;
    height: auto;
  }

  .brand {
    width: 100%;
    justify-content: center;
  }

  .nav-controls {
    width: 100%;
    justify-content: center;
    order: 3;
    flex-wrap: wrap;
  }

  .observer-info {
    width: 100%;
    text-align: center;
    order: 2;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
  }

  /* Nav Grid */
  .nav-grid {
    padding: 20px 15px;
  }
  
  .nav-grid-title {
    font-size: 1.5rem; /* Smaller font for mobile */
    letter-spacing: 1px;
    line-height: 1.3;
    word-break: break-word; /* Prevent overflow */
  }
  
  .nav-grid-subtitle {
    font-size: 0.9rem;
    padding: 0 10px;
  }
  
  .nav-card-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
    padding-bottom: 40px; /* Add bottom padding for scrolling */
  }

  .nav-card {
    height: 240px; /* Slightly shorter cards on mobile */
  }

  .glitch-title {
    font-size: 1.4rem;
  }
  
  .desc {
    font-size: 0.85rem;
    -webkit-line-clamp: 2;
  }
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
  0% { background-position: 0 0; background-size: 100% 7px; }
  50% { background-position: 0 50%; background-size: 100% 5px; }
  68% { background-position: 0 68%; background-size: 100% 14px; }
  85% { background-position: 0 85%; background-size: 100% 6px; }
  100% { background-position: 0 100%;   background-size: 100% 10px; }
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
