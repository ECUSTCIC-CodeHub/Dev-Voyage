<script setup lang="ts">
import { computed } from 'vue'
import { usePageFrontmatter, withBase } from '@vuepress/client'

// VuePress 会自动注册 .vuepress/components 目录下的组件
// 无需手动导入：AmadeusCard, AmadeusNeuralBg

const props = defineProps<{
  observerId: string
  divergence: string
  mousePos: { x: number; y: number }
}>()

const emit = defineEmits<{
  replay: []
}>()

interface WorldLine {
  path: string
  type: string
  divergence: string
  title: string
  desc: string
  bgImage?: string
}

const fm = usePageFrontmatter()
const worldLines = computed<WorldLine[]>(() => (fm.value as any).worldLines || [])

const handleReplay = () => {
  emit('replay')
}
</script>

<template>
  <div class="navigator-stage">
    <div class="star-bg"></div>
    <AmadeusNeuralBg :mouse-pos="mousePos" />

    <div class="nav-container">
      <header class="nav-header">
        <VPLink class="brand" href="/">
          <div class="logo-small"></div>
          <div class="text">
            <div class="h1">AMADEUS GATE</div>
            <div class="h2">SYSTEM ONLINE</div>
          </div>
        </VPLink>

        <div class="nav-controls">
          <button class="nav-btn" @click="handleReplay">[ REPLAY ]</button>
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

        <div class="worldline-timeline">
          <div class="timeline-line"></div>
          <AmadeusCard
            v-for="(line, index) in worldLines"
            :key="line.path"
            :line="line"
            :index="index"
            class="timeline-item"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { VPLink } from 'vuepress-theme-plume/client'
export default {
  components: { VPLink }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

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
  overflow-y: auto;
  overflow-x: hidden;
}

.star-bg {
  position: fixed;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  z-index: -2;
}

.nav-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  font-family: 'Share Tech Mono', monospace;
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
  text-decoration: none;
}

.brand:hover .logo-small {
  box-shadow: 0 0 15px #0ff, 0 0 30px #0ff;
}

.logo-small {
  width: 40px;
  height: 40px;
  border: 2px solid #0ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #0ff;
  transition: all 0.3s;
}

.text .h1 {
  font-size: 1.5rem;
  color: #fff;
  font-family: 'Share Tech Mono', monospace;
}

.text .h2 {
  font-size: 0.8rem;
  color: #0f0;
  font-family: 'Share Tech Mono', monospace;
}

.observer-info {
  text-align: right;
}

.div-val {
  font-size: 1.5rem;
  color: #f00;
  text-shadow: 0 0 10px #f00;
  animation: crt-jitter 0.1s infinite;
  font-family: 'Share Tech Mono', monospace;
}

.nav-grid {
  flex: 1;
  padding: 50px;
  perspective: 1000px;
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.nav-grid-subtitle {
  color: #0f0;
  font-size: 1.1rem;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  font-family: 'Share Tech Mono', monospace;
}

/* Timeline Layout */
.worldline-timeline {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding-left: 60px;
}

.timeline-line {
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    #0f0 10%,
    #0f0 90%,
    transparent
  );
  box-shadow: 0 0 10px #0f0;
}

.timeline-item {
  flex: 0 0 calc(25% - 22.5px);
  max-width: calc(25% - 22.5px);
}

@media (max-width: 1200px) {
  .timeline-item {
    flex: 0 0 calc(33.33% - 20px);
    max-width: calc(33.33% - 20px);
  }
}

@media (max-width: 900px) {
  .timeline-item {
    flex: 0 0 calc(50% - 15px);
    max-width: calc(50% - 15px);
  }
}

@media (max-width: 600px) {
  .timeline-item {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .worldline-timeline {
    padding-left: 20px;
  }

  .timeline-line {
    left: 10px;
  }
}

@keyframes crt-jitter {
  0% { transform: translate(0, 0); }
  25% { transform: translate(1px, 0); }
  50% { transform: translate(-1px, 0); }
  75% { transform: translate(0, 1px); }
  100% { transform: translate(0, -1px); }
}

@keyframes fade-up {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Mobile adaptation */
@media (max-width: 768px) {
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

  .nav-grid {
    padding: 20px 15px;
  }

  .nav-grid-title {
    font-size: 1.5rem;
    letter-spacing: 1px;
    word-break: break-word;
  }

  .nav-grid-subtitle {
    font-size: 0.9rem;
    padding: 0 10px;
  }
}
</style>
