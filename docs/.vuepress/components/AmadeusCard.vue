<script setup lang="ts">
import { withBase } from '@vuepress/client'

interface WorldLine {
  path: string
  type: string
  divergence: string
  title: string
  desc: string
  bgImage?: string
}

defineProps<{
  line: WorldLine
  index: number
}>()

// Glitch animation handlers
const glitchIntervals = new Map<HTMLElement, number>()

const startGlitch = (e: MouseEvent) => {
  const card = e.currentTarget as HTMLElement
  const bg = card.querySelector('.card-bg') as HTMLElement
  if (!bg) return

  if (glitchIntervals.has(card)) {
    clearInterval(glitchIntervals.get(card))
  }

  const intervalId = window.setInterval(() => {
    const isStrong = Math.random() > 0.9
    let tx, ty, skewX, skewY, scale

    if (isStrong) {
      tx = (Math.random() - 0.5) * 2
      ty = (Math.random() - 0.5) * 2
      skewX = (Math.random() - 0.5) * 80
      skewY = (Math.random() - 0.5) * 80
      scale = 1.1 + Math.random() * 0.1
    } else {
      tx = (Math.random() - 0.5) * 4
      ty = (Math.random() - 0.5) * 4
      skewX = (Math.random() - 0.5) * 2
      skewY = (Math.random() - 0.5) * 2
      scale = 1.1
    }

    bg.style.transform = `translate(${tx}px, ${ty}px) skew(${skewX}deg, ${skewY}deg) scale(${scale})`
  }, 50)

  glitchIntervals.set(card, intervalId)
}

const stopGlitch = (e: MouseEvent) => {
  const card = e.currentTarget as HTMLElement
  if (glitchIntervals.has(card)) {
    clearInterval(glitchIntervals.get(card))
    glitchIntervals.delete(card)
  }
  const bg = card.querySelector('.card-bg') as HTMLElement
  if (bg) {
    bg.style.transform = ''
  }
}
</script>

<template>
  <VPLink
    :href="line.path"
    class="nav-card"
    :style="{ animationDelay: `${index * 0.1}s` }"
    @mouseenter="startGlitch"
    @mouseleave="stopGlitch"
  >
    <div class="card-3d-wrapper">
      <div class="card-face">
        <div class="card-bg-container">
            <div
              class="card-bg"
              :style="{
                backgroundImage: `url(${line.bgImage ? withBase(line.bgImage) : 'https://picsum.photos/seed/amadeus/600/400'})`
              }"
            ></div>
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
</template>

<script lang="ts">
import { VPLink } from 'vuepress-theme-plume/client'
export default {
  components: { VPLink }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.nav-card {
  text-decoration: none;
  height: 280px;
  position: relative;
  transition: all 0.3s;
  animation: card-enter 0.8s backwards;
  background: #000;
  border: 2px solid #0f0;
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.2);
  font-family: 'Share Tech Mono', monospace;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.6);
  border-color: #fff;
  filter: url(#card-hover-distortion);
}

.nav-card::before,
.nav-card::after {
  display: none;
}

.card-3d-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  padding: 4px;
}

.card-face {
  width: 100%;
  height: 100%;
  background: #050505;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

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

.nav-card:hover .type-badge {
  background: #ffffff33;
  color: #ffffff;
  border-color: #fff;
  box-shadow: -3px 2px #ff0000, 3px 2px #0000ff;
}

.div-meter {
  font-family: monospace;
  font-size: 0.8rem;
}

.div-meter .label {
  color: #0f0;
  margin-right: 5px;
}

.div-meter .value {
  color: #f00;
  text-shadow: 0 0 5px #f00;
  display: inline-block;
}

.nav-card:hover .div-meter .value {
  animation: crt-jitter 0.05s infinite;
  color: #fff;
  text-shadow: 2px 0 #f00, -2px 0 #00f;
}

.nav-card:hover .type-badge,
.nav-card:hover .div-meter .label,
.nav-card:hover .status-indicator .dot,
.nav-card:hover .status-indicator .text {
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
  color: #ffffffcc;
  text-shadow: -5px 2px #f00, 3px 2px #00f;
}

.desc {
  color: #0f0;
  font-size: 0.9rem;
  line-height: 1.4;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.nav-card:hover .desc {
  color: #ffffffcc;
  text-shadow: -5px 2px #f00, -3px 2px #00f;
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
  border-radius: 0;
  animation: blink 1s steps(2) infinite;
}

.status-indicator .text {
  font-size: 0.7rem;
  color: #0f0;
}

.nav-card:hover .status-indicator .dot {
  background: #fff;
  box-shadow: 2px 0 #f00, -2px 0 #00f;
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
  color: #fff;
  background: #00000033;
  text-shadow: 2px 0 #f00, -2px 0 #00f;
  border-color: #fff;
  animation: blink 2s steps(6) infinite;
}

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
  filter: grayscale(100%) contrast(2) brightness(0.6) sepia(100%) hue-rotate(50deg) saturate(3);
}

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
  filter: grayscale(0%) contrast(1.1) brightness(1.2) sepia(0%);
}

@keyframes crt-jitter {
  0% { transform: translate(0, 0); }
  25% { transform: translate(1px, 0); }
  50% { transform: translate(-1px, 0); }
  75% { transform: translate(0, 1px); }
  100% { transform: translate(0, -1px); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes card-enter {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
