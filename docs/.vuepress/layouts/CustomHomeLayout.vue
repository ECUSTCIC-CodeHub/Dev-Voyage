<script setup lang="ts">
import { Layout } from 'vuepress-theme-plume/client'
import { Content, usePageFrontmatter } from 'vuepress/client'
import { computed } from 'vue'

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
</script>

<template>
  <Layout>
    <template #custom-content>
      <div class="custom-home-container">
        <div class="background-lines" aria-hidden="true"></div>
        <div class="background-filter"></div>
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-content-wrapper">
            <div class="hero-text-col">
              <h1 class="hero-title" v-if="hero.name">
                <span class="clip-text">{{ hero.name }}</span>
              </h1>
              <p class="hero-tagline" v-if="hero.tagline">{{ hero.tagline }}</p>
              <p class="hero-description" v-if="hero.text">{{ hero.text }}</p>
              
              <div class="hero-actions" v-if="hero.actions && hero.actions.length">
                <a 
                  v-for="action in hero.actions" 
                  :key="action.link" 
                  :href="action.link"
                  :class="['action-btn', action.theme]"
                >
                  {{ action.text }}
                </a>
              </div>
            </div>
            
            <div class="hero-image-col">
              <div class="image-container" v-if="hero.image">
                <img :src="hero.image" alt="Hero Image" class="hero-img" />
                <div class="image-bg-glow"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="features-section">
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🚀</div>
              <div class="feature-title">实践驱动的课程</div>
              <div class="feature-desc">从零搭建全栈项目，覆盖前端、后端与部署，学以致用。</div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🧭</div>
              <div class="feature-title">清晰的路线图</div>
              <div class="feature-desc">按阶段排列的学习计划，让进度可控，目标更明确。</div>
            </div>

            <div class="feature-card">
              <div class="feature-icon">🛠️</div>
              <div class="feature-title">实用工具与模板</div>
              <div class="feature-desc">提供常用脚手架、配置与最佳实践，提升开发效率。</div>
            </div>
          </div>
        </section>

        <!-- Latest Articles -->
        <section class="latest-section">
          <div class="latest-container">
            <div class="latest-title">最新文章</div>
            <div class="latest-list">
              <div class="post-card">
                <a href="/fullstack-course/">FullStack 课程总览</a>
                <div class="post-meta">入门 → 实战</div>
              </div>
              <div class="post-card">
                <a href="/docs/essential/">学习要点集合</a>
                <div class="post-meta">核心概念与命令行实践</div>
              </div>
              <div class="post-card">
                <a href="/projects/">项目集锦</a>
                <div class="post-meta">精选项目与演示</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Call To Action / Subscribe -->
        <!-- <section class="cta-section">
          <div class="cta-box">
            <div class="cta-text">
              <h3>想要收到更新吗？</h3>
              <p>订阅以获取最新文章与项目实践提醒（示例表单，未连接后端）。</p>
            </div>
            <div class="subscribe-input">
              <input type="email" placeholder="你的邮箱地址" aria-label="email" />
              <button class="action-btn brand">订阅</button>
            </div>
          </div>
        </section> -->

      </div>
    </template>
  </Layout>
</template>

<style scoped>
.custom-home-container {
  width: 100%;
  min-height: calc(100vh - var(--vp-nav-height));
  background-color: var(--vp-c-bg);
  position: relative;
}

/* Hero Section */
.hero-section {
    top: 5rem;
  position: relative;
  padding: 80px 24px;
  overflow: hidden;
}

.background-filter {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(4px);
  z-index: 0;
}


.hero-content-wrapper {
  max-width: 1152px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.hero-text-col {
  flex: 1;
  max-width: 600px;
  z-index: 1;
}


.hero-image-col {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

/* Typography */
.hero-title {
  font-size: 80px;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.clip-text {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-tagline {
  font-size: 50px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
  line-height: 1.3;
}

.hero-description {
  font-size: 18px;
  color: var(--vp-c-text-2);
  margin-bottom: 32px;
  line-height: 1.6;
}

/* Actions */
.hero-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 21fr));
  gap: 16px;
}

.action-btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.action-btn.brand {
  background-color: var(--vp-c-brand-1);
  color: var(--vp-c-white);
  border-color: var(--vp-c-brand-1);
}

.action-btn.brand:hover {
  background-color: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.action-btn.alt {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}

.action-btn.alt:hover {
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-text-2);
}

/* Image */
.image-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
}

.hero-img {
  width: 100%;
  height: auto;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.1));
}

.image-bg-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, var(--vp-c-brand-3) 0%, transparent 70%);
  opacity: 0.5;
  filter: blur(40px);
  z-index: 1;
}

/* Content Section */
.content-section {
  padding: 64px 24px;
  background-color: var(--vp-c-bg);
}

.content-container {
  max-width: 960px;
  margin: 0 auto;
}

/* Features */
.features-section {
  padding: 56px 24px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
}
.features-grid {
  max-width: 1152px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.feature-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1;
}
.feature-icon {
  font-size: 28px;
}
.feature-title {
  font-size: 20px;
  font-weight: 700;
}
.feature-desc {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
}

/* Latest */
.latest-section {
  padding: 56px 24px;
}
.latest-container {
  max-width: 1152px;
  margin: 0 auto;
  /* make a new stacking context so backdrop-filter can't affect this content */
  position: relative;
  z-index: 2;
}
.latest-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--vp-c-text-1);
  /* ensure the title sits above the background-filter */
  position: relative;
  z-index: 3;
}
.latest-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.post-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  padding: 18px;
  border-radius: 10px;
  z-index: 1;
}
.post-card a {
  color: var(--vp-c-text-1);
  font-weight: 600;
  text-decoration: none;
}
.post-meta {
  color: var(--vp-c-text-2);
  font-size: 13px;
  margin-top: 8px;
}

/* CTA */
.cta-section {
  padding: 48px 24px;
  background: linear-gradient(90deg, rgba(25,84,123,0.04), transparent);
  border-top: 1px solid var(--vp-c-divider);
}
.cta-box {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
}
.cta-text { flex: 1; }
.subscribe-input {
  display: flex;
  gap: 8px;
}
.subscribe-input input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-white);
}
.subscribe-input button { padding: 10px 14px; border-radius:8px; }

/* Responsive */
@media (max-width: 960px) {
  .hero-content-wrapper {
    flex-direction: column-reverse;
    text-align: center;
    gap: 32px;
  }

  .hero-text-col {
    max-width: 100%;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-title {
    font-size: 40px;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 32px;
  }
  
  .hero-tagline {
    font-size: 20px;
  }
}

@media (max-width: 960px) {
  .features-grid, .latest-list {
    grid-template-columns: 1fr;
  }
  .cta-box { flex-direction: column; text-align: center; }
}

/* Animated diagonal flowing lines (from left-bottom to right-top) */
.background-lines {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.06;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(0,0,0,0.9) 3px,
    rgba(0,0,0,0.9) 2px,
    transparent 50px,
    transparent 3px
  );
  background-size: 200% 200%;
  transform: translateZ(0);
  animation: flow-diagonal 120s linear infinite reverse;
}

@keyframes flow-diagonal {
  0% { background-position: 0% 100%; }
  100% { background-position: 100% 0%; }
}

/* Dark mode variants: use lighter lines on dark backgrounds */
@media (prefers-color-scheme: dark) {
  .background-lines {
    opacity: 0.06;
    background-image: repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.9) 10px,
      rgba(255,255,255,0.9) 10px,
      transparent 50px,
      transparent 3px
    );
  }
}

/* Also support common theme-class toggles used by VuePress/themes */
.theme-dark .background-lines,
.dark .background-lines,
.vp-theme-dark .background-lines {
  opacity: 0.06;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255,255,255,0.9) 3px,
    rgba(255,255,255,0.9) 2px,
    transparent 50px,
    transparent 3px
  );
}
</style>
