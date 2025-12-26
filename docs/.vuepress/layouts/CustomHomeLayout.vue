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
  actions?: { 
    text: string; 
    link: string; 
    theme?: string;
    icon?: string;
    description?: string;
  }[];
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
                <RouterLink 
                  v-for="action in hero.actions" 
                  :key="action.link" 
                  :to="action.link"
                  :class="['action-btn', action.theme]"
                >
                  {{ action.text }}
                </RouterLink>
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

        <!-- Tech Cards Section -->
        <section class="features-section" v-if="hero.actions && hero.actions.length">
          <div class="features-grid">
            <template v-for="(action, index) in hero.actions" :key="action.link">
              <component
                :is="action.link.startsWith('http') ? 'a' : 'RouterLink'"
                :href="action.link.startsWith('http') ? action.link : undefined"
                :to="!action.link.startsWith('http') ? action.link : undefined"
                :target="action.link.startsWith('http') ? '_blank' : undefined"
                :rel="action.link.startsWith('http') ? 'noopener noreferrer' : undefined"
                :class="['feature-card', 'tech-card', action.theme || 'default']"
              >
                <div class="card-bg"></div>
                
                <!-- Tech Decorations -->
                <div class="tech-index">0{{ index + 1 }}</div>
                <div class="corner-marker top-left"></div>
                <div class="corner-marker top-right"></div>
                <div class="corner-marker bottom-left"></div>
                <div class="corner-marker bottom-right"></div>

                <div class="feature-icon" v-if="action.icon">{{ action.icon }}</div>
                <div class="feature-content">
                  <div class="feature-title">
                    {{ action.text }}
                    <span class="arrow">{{ action.link.startsWith('http') ? '↗' : '→' }}</span>
                  </div>
                  <div class="feature-desc" v-if="action.description">{{ action.description }}</div>
                </div>
                
                <!-- Click Hint -->
                <div class="click-hint">
                  <span class="prompt">></span>
                  <span class="text">CLICK_ME</span>
                  <span class="cursor">_</span>
                </div>

                <div class="card-glow"></div>
                <div class="card-border"></div>
              </component>
            </template>
          </div>
        </section>

      </div>
    </template>
  </Layout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

.custom-home-container {
  width: 100%;
  min-height: calc(100vh - var(--vp-nav-height));
  background-color: var(--vp-c-bg);
  position: relative;
  font-family: 'Space Mono', monospace, system-ui;
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
  font-family:""
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
  display: none;
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
  background: transparent;
}
.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
}

.feature-card {
  position: relative;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 1;
  text-decoration: none;
  transition: all 0.2s ease;
  overflow: hidden;
  backdrop-filter: blur(10px);
  flex: 1 1 300px;
  max-width: 400px;
}

/* Theme variations */
.feature-card.brand {
  background: rgba(var(--vp-c-brand-1), 0.03);
  border-color: rgba(var(--vp-c-brand-1), 0.2);
}

.feature-card.alt {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 8px 8px 0 rgba(0,0,0,0.1);
}

/* Tech Decorations */
.tech-index {
  position: absolute;
  top: 12px;
  right: 12px;
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  color: var(--vp-c-text-3);
  opacity: 0.5;
  letter-spacing: 1px;
}

.corner-marker {
  position: absolute;
  width: 8px;
  height: 8px;
  border-color: var(--vp-c-text-3);
  border-style: solid;
  transition: all 0.3s ease;
  opacity: 0.3;
  pointer-events: none;
}

.feature-card:hover .corner-marker {
  opacity: 1;
  border-color: var(--vp-c-brand-1);
}

.top-left { top: 0; left: 0; border-width: 2px 0 0 2px; }
.top-right { top: 0; right: 0; border-width: 2px 2px 0 0; }
.bottom-left { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
.bottom-right { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

.feature-icon {
  font-size: 32px;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
}

.feature-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Space Mono', monospace;
}

.arrow {
  opacity: 0.6;
  transform: translateX(0);
  transition: all 0.3s ease;
  color: var(--vp-c-brand-1);
}

.feature-card:hover .arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* Click Hint */
.click-hint {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 10px;
  font-family: 'Space Mono', monospace;
  color: var(--vp-c-brand-1);
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  z-index: 2;
}

.feature-card:hover .click-hint {
  opacity: 1;
  transform: translateX(-4px);
  text-shadow: 0 0 8px rgba(var(--vp-c-brand-1), 0.5);
}

.prompt {
  font-weight: bold;
}

.text {
  font-weight: 700;
  letter-spacing: 1px;
}

.cursor {
  display: inline-block;
  width: 6px;
  height: 12px;
  background-color: var(--vp-c-brand-1);
}

.feature-card:hover .cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.feature-desc {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
  font-family: 'Space Mono', monospace;
}

/* Glow effect */
.card-glow {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, var(--vp-c-brand-3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  filter: blur(40px);
  z-index: 0;
}

.feature-card:hover .card-glow {
  opacity: 0.2;
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
  .image-container {
    width: clamp(50px, 40vw, 400px);
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
