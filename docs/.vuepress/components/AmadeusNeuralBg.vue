<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  mousePos: { x: number; y: number }
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrame: number = 0

onMounted(() => {
  initNeuralBg()
})

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
})

const initNeuralBg = () => {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')!
  const w = window.innerWidth
  const h = window.innerHeight
  canvasRef.value.width = w
  canvasRef.value.height = h

  const nodes: { x: number; y: number; vx: number; vy: number }[] = []
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
      const dx = props.mousePos.x - node.x
      const dy = props.mousePos.y - node.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < mouseDist) {
        ctx.beginPath()
        ctx.moveTo(props.mousePos.x, props.mousePos.y)
        ctx.lineTo(node.x, node.y)
        ctx.strokeStyle = `rgba(0, 255, 0, ${1 - dist / mouseDist})`
        ctx.stroke()

        node.x += dx * 0.0002
        node.y += dy * 0.0002
      }
    })

    requestAnimationFrame(draw)
  }
  draw()
}
</script>

<template>
  <canvas ref="canvasRef" class="neural-bg"></canvas>
</template>

<style scoped>
.neural-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
</style>
