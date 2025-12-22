<script setup lang="ts">
import { Layout } from 'vuepress-theme-plume/client'
import { Content, usePageFrontmatter } from 'vuepress/client'
import { computed, ref, onMounted } from 'vue'

const frontmatter = usePageFrontmatter<{
  config?: { hero?: Hero }[];
}>()

interface Hero {
  name?: string;
  tagline?: string;
  text?: string;
  image?: string;
  actions?: { text: string; link: string; theme?: string }[];
}

const hero = computed<Hero>(() => frontmatter.value.config?.[0]?.hero || {})
const showContent = ref(false)

onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 300)
})
</script>

<template>
  <Layout>
    <template #custom-content>
      <div class="custom-home-container">
        <!-- Animated Background -->
        <div class="animated-bg" aria-hidden="true"></div>
        <div class="gradient-overlay"></div>
        <div class="particles-container" aria-hidden="true"></div>
        
        <!-- Hero Section with Modern Design -->
        <section class="hero-section">
          <div class="hero-container">
            <div class="hero-content">
              <div class="hero-badge" v-if="hero.tagline">
                {{ hero.tagline }}
              </div>
              
              <h1 class="hero-title" v-if="hero.name">
                <span class="title-main">{{ hero.name }}</span>
                <span class="title-highlight"></span>
              </h1>
              
              <p class="hero-description" v-if="hero.text">{{ hero.text }}</p>
              
              <div class="hero-actions" v-if="hero.actions && hero.actions.length">
                <div class="actions-group">
                  <RouterLink 
                    v-for="(action, index) in hero.actions" 
                    :key="action.link" 
                    :to="action.link"
                    :class="['action-btn', action.theme, {'primary': action.theme === 'brand'}]"
                    :style="{ animationDelay: `${index * 150}ms` }"
                  >
                    <span class="btn-text">{{ action.text }}</span>
                    <span class="btn-icon" v-if="action.theme === 'brand'">→</span>
                  </RouterLink>
                </div>
              </div>
            </div>

            <div class="hero-visual">
              <div class="visual-card" v-if="hero.image">
                <div class="card-content">
                  <img :src="hero.image" alt="Hero Visual" class="hero-image" />
                  <div class="card-glow"></div>
                </div>
              </div>
              <div class="visual-decorations">
                <div class="decoration-circle decoration-1"></div>
                <div class="decoration-circle decoration-2"></div>
                <div class="decoration-grid"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Section with Card Design -->
        <section 
          class="features-section" 
          :class="{ 'visible': showContent }"
        >
          <div class="features-container">
            <div class="section-header">
              <h2 class="section-title">学习路径</h2>
              <p class="section-subtitle">从基础到实践的完整旅程</p>
            </div>
            
            <div class="features-grid">
              <div class="feature-card hover-lift">
                <div class="feature-icon-wrapper">
                  <span class="feature-icon">🚀</span>
                </div>
                <h3 class="feature-title">实践驱动的课程</h3>
                <p class="feature-desc">从零搭建全栈项目，覆盖前端、后端与部署，学以致用。</p>
                <div class="feature-decoration"></div>
              </div>

              <div class="feature-card hover-lift">
                <div class="feature-icon-wrapper">
                  <span class="feature-icon">🧭</span>
                </div>
                <h3 class="feature-title">清晰的路线图</h3>
                <p class="feature-desc">按阶段排列的学习计划，让进度可控，目标更明确。</p>
                <div class="feature-decoration"></div>
              </div>

              <div class="feature-card hover-lift">
                <div class="feature-icon-wrapper">
                  <span class="feature-icon">🛠️</span>
                </div>
                <h3 class="feature-title">实用工具与模板</h3>
                <p class="feature-desc">提供常用脚手架、配置与最佳实践，提升开发效率。</p>
                <div class="feature-decoration"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Latest Articles with Enhanced Design -->
        <section 
          class="latest-section"
          :class="{ 'visible': showContent }"
        >
          <div class="latest-container">
            <div class="section-header">
              <h2 class="section-title">最新文章</h2>
              <p class="section-subtitle">精选内容，持续更新</p>
            </div>
            
            <div class="latest-grid">
              <RouterLink to="/fullstack-course/" class="post-card hover-raise">
                <div class="post-content">
                  <h3 class="post-title">FullStack 课程总览</h3>
                  <p class="post-excerpt">从零到一的全栈开发实战指南，包含完整的项目流程和最佳实践。</p>
                  <div class="post-footer">
                    <span class="post-tag">入门 → 实战</span>
                    <span class="post-arrow">→</span>
                  </div>
                </div>
              </RouterLink>
              <RouterLink to="/docs/essential/" class="post-card hover-raise">
                <div class="post-content">
                  <h3 class="post-title">学习要点集合</h3>
                  <p class="post-excerpt">核心概念与命令行实践，掌握开发必备的基础知识。</p>
                  <div class="post-footer">
                    <span class="post-tag">核心概念</span>
                    <span class="post-arrow">→</span>
                  </div>
                </div>
              </RouterLink>
              <RouterLink to="/projects/" class="post-card hover-raise">
                <div class="post-content">
                  <h3 class="post-title">项目集锦</h3>
                  <p class="post-excerpt">精选项目与演示，提供完整的代码和部署方案。</p>
                  <div class="post-footer">
                    <span class="post-tag">项目案例</span>
                    <span class="post-arrow">→</span>
                  </div>
                </div>
              </RouterLink>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
          <div class="cta-container">
            <div class="cta-content">
              <h3 class="cta-title">准备好开始了吗？</h3>
              <p class="cta-text">加入社区，与更多开发者一起学习和成长。</p>
            </div>
            <div class="cta-actions">
              <RouterLink to="https://github.com/ECUSTCIC-CodeHub/FullStack-Voyage" class="cta-btn primary">
                GitHub 开源
              </RouterLink>
              <RouterLink to="/fullstack-course/" class="cta-btn secondary">
                开始学习
              </RouterLink>
            </div>
          </div>
        </section>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
/* ===== Base Styles ===== */
.custom-home-container {
  width: 100%;
  min-height: calc(100vh - var(--vp-nav-height));
  background: linear-gradient(135deg, 
    var(--vp-c-bg) 0%, 
    rgba(25, 84, 123, 0.02) 50%, 
    var(--vp-c-bg) 100%);
  position: relative;
  overflow-x: hidden;
}

/* ===== Animated Background ===== */
.animated-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(25, 84, 123, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 216, 155, 0.06) 0%, transparent 50%);
  animation: backgroundPulse 12s ease-in-out infinite;
}

.gradient-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, 
    transparent 0%, 
    rgba(0, 0, 0, 0.02) 50%, 
    transparent 100%);
  pointer-events: none;
}

.particles-container {
  position: fixed;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.3) 50%, transparent 100%),
    radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.2) 50%, transparent 100%),
    radial-gradient(1px 1px at 80% 20%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  background-size: 200px 200px, 300px 300px, 250px 250px;
  animation: particleFloat 20s linear infinite;
  opacity: 0.4;
}

@keyframes backgroundPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes particleFloat {
  0% { background-position: 0% 0%, 0% 0%, 0% 0%; }
  100% { background-position: 100% 100%, 100% 100%, 100% 100%; }
}

/* ===== Hero Section ===== */
.hero-section {
  position: relative;
  padding: 120px 24px 80px;
  z-index: 10;
}

.hero-container {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 60px;
  align-items: center;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-block;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(25, 84, 123, 0.15), rgba(255, 216, 155, 0.15));
  border: 1px solid rgba(25, 84, 123, 0.3);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 24px;
  animation: slideUp 0.6s ease-out;
  backdrop-filter: blur(10px);
}

.hero-title {
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 16px 0;
  letter-spacing: -0.02em;
  animation: slideUp 0.6s ease-out 0.1s both;
}

.title-main {
  background: linear-gradient(135deg, 
    #19547b 0%, 
    #ffd89b 50%, 
    #19547b 100%);
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientMove 6s ease infinite;
}

.title-highlight {
  display: block;
  height: 4px;
  width: 80px;
  background: linear-gradient(90deg, #19547b, #ffd89b);
  border-radius: 2px;
  margin-top: 12px;
  animation: expandWidth 0.8s ease-out 0.3s both;
}

.hero-description {
  font-size: 18px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin-bottom: 32px;
  animation: slideUp 0.6s ease-out 0.2s both;
  max-width: 600px;
}

.hero-actions {
  animation: slideUp 0.6s ease-out 0.3s both;
}

.actions-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
  white-space: nowrap;
}

.action-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.action-btn:hover::before {
  transform: translateX(100%);
}

.action-btn.brand {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
  box-shadow: 0 4px 20px rgba(25, 84, 123, 0.3);
}

.action-btn.brand:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(25, 84, 123, 0.4);
}

.action-btn.alt {
  background: rgba(255, 255, 255, 0.05);
  color: var(--vp-c-text-1);
  border-color: rgba(255, 255, 255, 0.2);
}

.action-btn.alt:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.btn-icon {
  font-weight: 900;
  transition: transform 0.3s ease;
}

.action-btn:hover .btn-icon {
  transform: translateX(4px);
}

/* ===== Hero Visual ===== */
.hero-visual {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  perspective: 1000px;
  animation: float 6s ease-in-out infinite;
}

.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(25, 84, 123, 0.1), rgba(255, 216, 155, 0.1));
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.hero-image {
  width: 70%;
  height: auto;
  z-index: 2;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  transform: translateZ(20px);
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255, 216, 155, 0.3), transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 1;
}

.visual-card:hover .card-glow {
  opacity: 1;
}

.visual-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  animation: rotate 20s linear infinite;
}

.decoration-1 {
  width: 60px;
  height: 60px;
  top: -20px;
  right: -20px;
  animation-duration: 25s;
}

.decoration-2 {
  width: 40px;
  height: 40px;
  bottom: -10px;
  left: -10px;
  animation-duration: 18s;
  animation-direction: reverse;
}

.decoration-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
  transform: rotate(45deg);
}

/* ===== Features Section ===== */
.features-section {
  position: relative;
  padding: 80px 24px;
  z-index: 10;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.features-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-title {
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 800;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, var(--vp-c-text-1), var(--vp-c-brand-1));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  font-size: 18px;
  color: var(--vp-c-text-2);
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 40px;
}

.feature-card {
  position: relative;
  background: var(--vp-c-bg-soft);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.hover-lift:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
}

.feature-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, rgba(25, 84, 123, 0.2), rgba(255, 216, 155, 0.2));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 24px;
}

.feature-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: var(--vp-c-text-1);
}

.feature-desc {
  font-size: 15px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}

.feature-decoration {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, rgba(25, 84, 123, 0.15), transparent 70%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.feature-card:hover .feature-decoration {
  opacity: 1;
}

/* ===== Latest Articles Section ===== */
.latest-section {
  position: relative;
  padding: 80px 24px;
  z-index: 10;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.2s;
}

.latest-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.latest-container {
  max-width: 1200px;
  margin: 0 auto;
}

.latest-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.post-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 28px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: block;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.post-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(25, 84, 123, 0.05), rgba(255, 216, 155, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hover-raise:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
}

.hover-raise:hover::before {
  opacity: 1;
}

.post-content {
  position: relative;
  z-index: 1;
}

.post-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

.post-excerpt {
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0 0 16px 0;
  min-height: 48px;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.post-tag {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  background: rgba(25, 84, 123, 0.15);
  border-radius: 12px;
  color: var(--vp-c-brand-1);
}

.post-arrow {
  font-size: 18px;
  font-weight: 900;
  color: var(--vp-c-brand-1);
  transition: transform 0.3s ease;
}

.post-card:hover .post-arrow {
  transform: translateX(4px);
}

/* ===== CTA Section ===== */
.cta-section {
  position: relative;
  padding: 80px 24px 100px;
  z-index: 10;
  background: linear-gradient(180deg, transparent, rgba(25, 84, 123, 0.05), transparent);
}

.cta-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  text-align: center;
}

.cta-content {
  max-width: 600px;
}

.cta-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  margin: 0 0 12px 0;
  color: var(--vp-c-text-1);
}

.cta-text {
  font-size: 18px;
  color: var(--vp-c-text-2);
  margin: 0;
}

.cta-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.cta-btn {
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  white-space: nowrap;
}

.cta-btn.primary {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
  box-shadow: 0 4px 20px rgba(25, 84, 123, 0.3);
}

.cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(25, 84, 123, 0.4);
}

.cta-btn.secondary {
  background: transparent;
  color: var(--vp-c-text-1);
  border-color: rgba(255, 255, 255, 0.3);
}

.cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

/* ===== Animations ===== */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradientMove {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes expandWidth {
  from { width: 0; }
  to { width: 80px; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotateZ(0deg); }
  50% { transform: translateY(-10px) rotateZ(1deg); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== Responsive Design ===== */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-visual {
    order: -1;
  }

  .visual-card {
    max-width: 320px;
    margin: 0 auto;
  }

  .features-grid,
  .latest-grid {
    grid-template-columns: 1fr;
  }

  .cta-actions {
    flex-direction: column;
    width: 100%;
  }

  .cta-btn {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .hero-section,
  .features-section,
  .latest-section {
    padding: 40px 16px;
  }

  .hero-badge {
    font-size: 12px;
    padding: 6px 12px;
  }

  .visual-card {
    max-width: 100%;
    width: 100%;
    aspect-ratio: 1;
  }

  .hero-image {
    width: 90%;
  }

  .feature-card,
  .post-card {
    padding: 20px;
  }

  .actions-group {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .section-header {
    margin-bottom: 30px;
  }
}

/* ===== Accessibility & Dark Mode Support ===== */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode support for enhanced contrast */
.theme-dark .animated-bg,
.dark .animated-bg,
.vp-theme-dark .animated-bg {
  opacity: 0.8;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .action-btn,
  .cta-btn {
    border-width: 3px;
  }

  .feature-card,
  .post-card {
    border-width: 2px;
  }
}
</style>
