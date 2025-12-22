<script setup lang="ts">
import { Layout } from 'vuepress-theme-plume/client'
import { usePageFrontmatter } from 'vuepress/client'
import { computed } from 'vue'

interface Hero {
  name?: string;
  tagline?: string;
  text?: string;
  actions?: { text: string; link: string; theme?: string }[];
}

const frontmatter = usePageFrontmatter<{
  config?: { hero?: Hero }[];
}>()

const hero = computed<Hero>(() => frontmatter.value.config?.[0]?.hero || {})

// 计算器：创建课程卡片数据
const courseCards = computed(() => [
  {
    title: '命令行基础教程',
    description: '掌握终端操作，提升开发效率',
    icon: '💻',
    link: '/essential/command-line/',
    features: ['基础命令', '文件系统', 'Shell脚本', '环境变量']
  },
  {
    title: '别慌！计算机其实很好懂',
    description: '小白理解现代操作系统，玩转现代的计算设备',
    icon: '🖥️',
    link: '/essential/elementary-system/',
    features: ['应用程序', '系统设置', '文件系统', '网络基础']
  },
  {
    title: '版本控制基础教程',
    description: 'Git版本控制与团队协作',
    icon: '🔧',
    link: '/essential/git-usage/',
    features: ['Git基础', '分支管理', '协作流程', '最佳实践']
  }
])

// 技术栈标签
const techStack = ['Terminal', 'Bash', 'Git', 'Linux', 'CLI', 'DevTools']
</script>

<template>
  <Layout>
    <template #custom-content>
      <div class="tech-container">
        <!-- 背景特效 -->
        <div class="cyber-grid"></div>
        <div class="ambient-glow"></div>
        
        <!-- Hero 区域 -->
        <section class="hero-section">
          <div class="content-wrapper">
            <div class="hero-text">
              <div class="glitch-wrapper" v-if="hero.name">
                <h1 class="hero-title" :data-text="hero.name">{{ hero.name }}</h1>
              </div>
              
              <p class="hero-tagline" v-if="hero.tagline">
                <span class="terminal-prompt">></span>
                <span class="typewriter">{{ hero.tagline }}</span>
                <span class="cursor">_</span>
              </p>
              
              <p class="hero-desc" v-if="hero.text">{{ hero.text }}</p>
              
              <div class="hero-actions" v-if="hero.actions?.length">
                <RouterLink 
                  v-for="action in hero.actions" 
                  :key="action.link" 
                  :to="action.link"
                  :class="['tech-btn', action.theme === 'brand' ? 'primary' : 'secondary']"
                >
                  <span class="btn-content">{{ action.text }}</span>
                  <div class="btn-glitch"></div>
                </RouterLink>
              </div>

              <div class="tech-stack" v-if="techStack.length">
                <span class="stack-label">SYSTEM_MODULES //</span>
                <div class="stack-tags">
                  <span v-for="tech in techStack" :key="tech" class="tech-tag">
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 视觉装饰 -->
            <div class="hero-visual">
              <div class="hologram-container">
                <div class="scanner-line"></div>
                <div class="hologram-circle"></div>
                <div class="hologram-icon">⚡</div>
                <div class="data-ring"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 课程卡片区域 -->
        <section class="courses-section">
          <div class="section-header">
            <h2 class="section-title">CORE_COURSES</h2>
            <div class="section-line"></div>
          </div>

          <div class="courses-grid">
            <div 
              v-for="(course, index) in courseCards" 
              :key="course.link"
              class="tech-card"
              @click="$router.push(course.link)"
              :style="{ '--delay': `${index * 0.1}s` }"
            >
              <div class="card-border"></div>
              <div class="card-content">
                <div class="card-header">
                  <span class="card-icon">{{ course.icon }}</span>
                  <h3 class="card-title">{{ course.title }}</h3>
                </div>
                <p class="card-desc">{{ course.description }}</p>
                <div class="card-features">
                  <span v-for="f in course.features" :key="f" class="feature-pill">
                    {{ f }}
                  </span>
                </div>
                <div class="card-action">
                  <span>ACCESS_MODULE</span>
                  <span class="arrow">>></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;600;800&display=swap');

.tech-container {
  /* Light Mode Defaults */
  --tech-primary: #06b6d4;
  --tech-secondary: #9333ea;
  --tech-grid-color: rgba(6, 182, 212, 0.05);
  --tech-glow-color: rgba(147, 51, 234, 0.1);
  --tech-title-gradient: linear-gradient(to right, #2563eb, #7c3aed);
  --tech-card-bg: rgba(0, 0, 0, 0.02);
  --tech-card-border: rgba(0, 0, 0, 0.05);
  --tech-btn-secondary-bg: rgba(0, 0, 0, 0.05);
  --tech-btn-secondary-border: rgba(0, 0, 0, 0.1);
  --tech-pill-bg: rgba(0, 0, 0, 0.05);
  --tech-tag-bg: rgba(6, 182, 212, 0.1);
  --tech-tag-border: rgba(6, 182, 212, 0.2);
  --tech-ring-color: rgba(147, 51, 234, 0.4);
  --tech-icon-shadow: drop-shadow(0 0 20px rgba(6, 182, 212, 0.5));

  min-height: calc(100vh - var(--vp-nav-height));
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
  padding-bottom: 60px;
}

:global(.dark) .tech-container {
  /* Dark Mode Overrides */
  --tech-primary: #00f3ff;
  --tech-secondary: #bc13fe;
  --tech-grid-color: rgba(0, 243, 255, 0.03);
  --tech-glow-color: rgba(188, 19, 254, 0.15);
  --tech-title-gradient: linear-gradient(to right, #afff, #a5b4fc);
  --tech-card-bg: rgba(255, 255, 255, 0.03);
  --tech-card-border: rgba(255, 255, 255, 0.1);
  --tech-btn-secondary-bg: rgba(255, 255, 255, 0.05);
  --tech-btn-secondary-border: rgba(255, 255, 255, 0.2);
  --tech-pill-bg: rgba(255, 255, 255, 0.05);
  --tech-tag-bg: rgba(0, 243, 255, 0.1);
  --tech-tag-border: rgba(0, 243, 255, 0.2);
  --tech-ring-color: rgba(188, 19, 254, 0.4);
  --tech-icon-shadow: drop-shadow(0 0 20px rgba(0, 243, 255, 0.5));
}

/* Background Effects */
.cyber-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--tech-grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--tech-grid-color) 1px, transparent 1px);
  background-size: 40px 40px;
  transform: perspective(500px) rotateX(60deg) translateY(-100px) scale(2);
  transform-origin: top center;
  animation: gridScroll 20s linear infinite;
  pointer-events: none;
  z-index: 0;
}

.ambient-glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 60vw;
  height: 60vw;
  background: radial-gradient(circle, var(--tech-glow-color), transparent 70%);
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

@keyframes gridScroll {
  0% { background-position: 0 0; }
  100% { background-position: 0 40px; }
}

/* Layout */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  position: relative;
  z-index: 1;
}

/* Hero Typography */
.hero-text {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
  background: var(--tech-title-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  text-transform: uppercase;
  letter-spacing: -2px;
}

.hero-tagline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  color: var(--vp-c-brand-1);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.terminal-prompt { color: var(--tech-primary); }
.cursor { animation: blink 1s step-end infinite; }

@keyframes blink { 50% { opacity: 0; } }

.hero-desc {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 480px;
}

/* Buttons */
.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tech-btn {
  position: relative;
  padding: 12px 32px;
  font-weight: 600;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
  transition: all 0.3s ease;
}

.tech-btn.primary {
  background: var(--vp-c-brand-1);
  color: #fff;
  border: 1px solid transparent;
}

.tech-btn.primary:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(var(--vp-c-brand-1), 0.4);
}

.tech-btn.secondary {
  background: var(--tech-btn-secondary-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--tech-btn-secondary-border);
}

.tech-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--vp-c-brand-1);
}

/* Tech Stack */
.tech-stack {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
}

.stack-label {
  color: var(--vp-c-text-3);
  display: block;
  margin-bottom: 0.5rem;
}

.stack-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  padding: 4px 8px;
  background: var(--tech-tag-bg);
  color: var(--vp-c-brand-1);
  border: 1px solid var(--tech-tag-border);
  border-radius: 2px;
}

/* Visual Hologram */
.hero-visual {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hologram-container {
  width: 300px;
  height: 300px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hologram-circle {
  position: absolute;
  inset: 0;
  border: 2px solid var(--tech-tag-border);
  border-radius: 50%;
  animation: spin 10s linear infinite;
}

.hologram-circle::before {
  content: '';
  position: absolute;
  top: -5px; left: 50%;
  width: 10px; height: 10px;
  background: var(--tech-primary);
  box-shadow: 0 0 10px var(--tech-primary);
  border-radius: 50%;
}

.data-ring {
  position: absolute;
  inset: 40px;
  border: 1px dashed var(--tech-ring-color);
  border-radius: 50%;
  animation: spin 15s linear infinite reverse;
}

.hologram-icon {
  font-size: 5rem;
  filter: var(--tech-icon-shadow);
  animation: float 3s ease-in-out infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

/* Courses Section */
.courses-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.section-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  color: var(--vp-c-text-1);
  letter-spacing: 1px;
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), transparent);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.tech-card {
  background: var(--tech-card-bg);
  border: 1px solid var(--tech-card-border);
  padding: 2rem;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.tech-card:hover {
  transform: translateY(-5px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.tech-card:hover .card-border {
  opacity: 1;
}

.card-border {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 2px;
  background: linear-gradient(90deg, transparent, var(--vp-c-brand-1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-icon { font-size: 1.5rem; }

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.card-desc {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.feature-pill {
  font-size: 0.75rem;
  padding: 2px 8px;
  background: var(--tech-pill-bg);
  border-radius: 10px;
  color: var(--vp-c-text-2);
}

.card-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--vp-c-brand-1);
  opacity: 0.8;
}

.tech-card:hover .card-action { opacity: 1; }

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    text-align: center;
    padding-top: 40px;
  }
  
  .hero-tagline { justify-content: center; }
  .hero-actions { justify-content: center; }
  .stack-tags { justify-content: center; }
  
  .hero-title { font-size: 2.5rem; }
}
</style>
