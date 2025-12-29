<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  activeStructures: {
    cnn: boolean
    rnn: boolean
    transformer: boolean
  }
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrame: number = 0

onMounted(() => {
  initChaosCanvas()
})

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
})

const initChaosCanvas = () => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')!
  const w = window.innerWidth
  const h = window.innerHeight
  canvasRef.value.width = w
  canvasRef.value.height = h

  const charsCode = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\*&^%$#@!'.split('')
  const charsMath = '∑∫π∞√∆∇∈∉⊂⊃∪∩∧∨¬⇒⇔∀∃=><?1234567890'.split('')
  const charsNet = '○●□■△▲◇◆◈◉◊◌◍◎●○◔◕◖◗◣◤◢◥◨◧◩◪◫◬◭◮◯'.split('')

  const drops: { x: number, y: number, speed: number, text: string, color: string }[] = []
  const dropCount = w < 768 ? 200 : 1000

  for (let i = 0; i < dropCount; i++) {
    const type = Math.random()
    let text, color
    if (type < 0.6) {
       text = charsCode[Math.floor(Math.random() * charsCode.length)]
       color = '#0f0'
    } else if (type < 0.8) {
       text = charsMath[Math.floor(Math.random() * charsMath.length)]
       color = '#00f'
    } else {
       text = charsNet[Math.floor(Math.random() * charsNet.length)]
       color = '#0ff'
    }

    drops.push({
      x: Math.random() * w,
      y: Math.random() * h - h,
      speed: 5 + Math.random() * 10,
      text,
      color
    })
  }

  const draw = () => {
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
        if (drop.color === '#0f0') drop.text = charsCode[Math.floor(Math.random() * charsCode.length)]
        else if (drop.color === '#00f') drop.text = charsMath[Math.floor(Math.random() * charsMath.length)]
        else drop.text = charsNet[Math.floor(Math.random() * charsNet.length)]
      }
    })

    animFrame = requestAnimationFrame(draw)
  }
  draw()
}
</script>

<template>
  <div class="chaos-stage">
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
         <svg class="rnn-svg" viewBox="0 0 300 140" xmlns="http://www.w3.org/2000/svg">
           <defs>
             <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
               <polygon points="0 0, 10 3.5, 0 7" fill="#0ff" />
             </marker>
             <filter id="glow">
               <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
               <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
               </feMerge>
             </filter>
           </defs>

           <line x1="70" y1="80" x2="105" y2="80" stroke="#0ff" stroke-width="2" marker-end="url(#arrowhead)" class="rnn-conn" />
           <line x1="160" y1="80" x2="195" y2="80" stroke="#0ff" stroke-width="2" marker-end="url(#arrowhead)" class="rnn-conn" />

           <g class="rnn-node-group opacity-50">
             <rect x="20" y="55" width="50" height="50" rx="8" stroke="#0ff" stroke-width="2" fill="rgba(0, 255, 255, 0.1)" stroke-dasharray="4 2" />
             <text x="45" y="85" fill="#0ff" text-anchor="middle" font-family="monospace" font-size="14">h<tspan dy="5" font-size="10">t-1</tspan></text>
           </g>

           <g class="rnn-node-group active">
             <rect x="110" y="55" width="50" height="50" rx="8" stroke="#0ff" stroke-width="2" fill="rgba(0, 255, 255, 0.2)" filter="url(#glow)" />
             <text x="135" y="85" fill="#fff" text-anchor="middle" font-family="monospace" font-size="14" font-weight="bold">h<tspan dy="5" font-size="10">t</tspan></text>
             <path d="M 130 55 C 105 20, 165 20, 140 55" fill="none" stroke="#0ff" stroke-width="2" marker-end="url(#arrowhead)" class="rnn-loop-path" />
             <circle r="3" fill="#fff" filter="url(#glow)">
               <animateMotion dur="1.5s" repeatCount="indefinite" path="M 130 55 C 105 20, 165 20, 140 55" />
             </circle>
           </g>

           <g class="rnn-node-group opacity-50">
             <rect x="200" y="55" width="50" height="50" rx="8" stroke="#0ff" stroke-width="2" fill="rgba(0, 255, 255, 0.1)" stroke-dasharray="4 2" />
             <text x="225" y="85" fill="#0ff" text-anchor="middle" font-family="monospace" font-size="14">h<tspan dy="5" font-size="10">t+1</tspan></text>
           </g>
         </svg>
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
    <div class="flash-overlay"></div>
  </div>
</template>

<style scoped>
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
  transform: scale(4);
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
  width: 105px;
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
  transform: scale(3);
}

.rnn-svg {
  width: 300px;
  height: 140px;
  overflow: visible;
}

.rnn-loop-path {
  stroke-dasharray: 10;
  animation: dash-flow 1s linear infinite;
}

@keyframes dash-flow {
  to { stroke-dashoffset: -20; }
}

/* Transformer Structure */
.structure-transformer {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 500px;
  animation: flash-cycle-long 2s ease-out forwards;
  transform: scale(3);
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
  0% { opacity: 0; transform: scale(3); }
  10% { opacity: 1; transform: scale(4); }
  50% { opacity: 1; transform: scale(4); }
  100% { opacity: 0; transform: scale(5); filter: blur(4px); }
}

@keyframes flash-cycle-long {
  0% { opacity: 0; transform: scale(2); }
  10% { opacity: 1; transform: scale(3); }
  60% { opacity: 1; transform: scale(3); }
  100% { opacity: 0; transform: scale(4); filter: blur(4px); }
}

@keyframes rotate-3d {
  0% { transform: rotateX(0) rotateY(0); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
}

.matrix-canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
