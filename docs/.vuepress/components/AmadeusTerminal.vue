<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  typedText: string
  isTypingComplete: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<template>
  <div class="terminal-container" @click="handleClick">
    <div class="screen-curvature">
      <div class="terminal-content">
        <div class="header">
          {{ typedText }}<span class="cursor-blink">_</span>
        </div>
        <div v-if="isTypingComplete" class="start-prompt">
          [ 点击任意位置开始时间线跳跃 ]
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

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
  cursor: pointer;
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
  transition: all 0.3s;
}

@media (max-width: 768px) {
  .screen-curvature {
    padding: 20px;
  }
}

.terminal-container:hover .screen-curvature {
  box-shadow: 0 0 60px rgba(0, 255, 0, 0.8), inset 0 0 50px rgba(0, 255, 0, 0.4);
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
  font-family: 'Share Tech Mono', monospace;
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

.start-prompt {
  margin-top: 20px;
  color: #0f0;
  font-size: 1rem;
  animation: pulse 1.5s ease-in-out infinite;
  text-align: center;
  width: 100%;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes text-distortion {
  0% { transform: skewX(0deg); }
  2% { transform: skewX(2deg); filter: blur(0.5px); }
  4% { transform: skewX(-2deg); filter: blur(0px); }
  6% { transform: skewX(0deg); }
  100% { transform: skewX(0deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; text-shadow: 0 0 10px #0f0; }
}
</style>
