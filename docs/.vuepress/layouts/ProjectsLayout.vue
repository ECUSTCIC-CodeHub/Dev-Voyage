<script setup lang="ts">
import { Layout } from 'vuepress-theme-plume/client'
import { usePageFrontmatter } from 'vuepress/client'
import { computed, ref, onMounted } from 'vue'

interface Project {
  name: string
  icon?: string
  image?: string
  description: string
  author: string
  authorAvatar?: string
  authorGithub?: string
  year?: string
  techs: string[]
  github?: string
  demo?: string
  category?: string
  featured?: boolean
}

interface PageConfig {
  hero?: {
    name?: string
    tagline?: string
    description?: string
  }
  projects?: Project[]
  categories?: string[]
}

const test_connect = ref(false)

onMounted(async () => {
  const response = await fetch("/Dev-Voyage/")
  test_connect.value = response.ok
})

const frontmatter = usePageFrontmatter<{ config?: PageConfig }>()

const config = computed<PageConfig>(() => frontmatter.value.config || {})
const hero = computed(() => config.value.hero || {})

const projects = computed(() =>
  (config.value.projects || []).map(p => {
    if (p.image && !p.image.startsWith('http') && test_connect.value) {
      p.image = `/Dev-Voyage/${p.image}`
    }
    return p
  })
)

const categories = computed(() => config.value.categories || ['全部'])

const activeCategory = ref('全部')

const filteredProjects = computed(() => {
  if (activeCategory.value === '全部') {
    return projects.value
  }
  return projects.value.filter(p => p.category === activeCategory.value)
})

const featuredProjects = computed(() => projects.value.filter(p => p.featured))

function setCategory(cat: string) {
  activeCategory.value = cat
}
</script>


<template>
  <Layout>
    <template #custom-content>
      <div class="projects-container">
        <!-- Retro Grid Background -->
        <div class="bg-grid" aria-hidden="true"></div>
        
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-content">
            <div class="hero-decoration-top"></div>
            <div class="hero-icon-wrapper">
              <div class="hero-icon">⚡</div>
            </div>
            <h1 class="hero-title" v-if="hero.name">
              <span class="tech-text">{{ hero.name }}</span>
            </h1>
            <p class="hero-tagline" v-if="hero.tagline">
              <span class="prompt">></span> {{ hero.tagline }} <span class="cursor">_</span>
            </p>
            <p class="hero-description" v-if="hero.description">{{ hero.description }}</p>
          </div>
        </section>

        <!-- Featured Projects Section -->
        <section class="featured-section" v-if="featuredProjects.length > 0">
          <div class="section-container">
            <div class="section-header">
              <h2 class="section-title">
                <span class="section-icon">★</span> 精选项目
              </h2>
              <p class="section-subtitle">SELECTED_WORKS // 学长学姐们的优秀作品</p>
            </div>

            <div class="featured-grid">
              <div
                v-for="project in featuredProjects"
                :key="project.name"
                class="featured-card"
              >
                <div class="featured-image">
                  <div class="image-placeholder" v-if="!project.image">
                    <span class="project-icon">{{ project.icon || '📦' }}</span>
                  </div>
                  <img v-else :src="project.image" :alt="project.name" />
                  <div class="featured-badge">FEATURED</div>
                </div>

                <div class="featured-content">
                  <div class="content-header">
                    <h3 class="project-name">{{ project.name }}</h3>
                    <div class="project-year-badge" v-if="project.year">{{ project.year }}</div>
                  </div>
                  
                  <p class="project-desc">{{ project.description }}</p>

                  <div class="tech-tags">
                    <span v-for="tech in project.techs" :key="tech" class="tech-tag">
                      {{ tech }}
                    </span>
                  </div>

                  <div class="project-footer">
                    <div class="author-info">
                      <img
                        v-if="project.authorAvatar"
                        :src="project.authorAvatar"
                        :alt="project.author"
                        class="author-avatar"
                      />
                      <div v-else class="author-avatar-placeholder">
                        {{ project.author.charAt(0) }}
                      </div>
                      <div class="author-details">
                        <span class="author-label">AUTHOR</span>
                        <span class="author-name">{{ project.author }}</span>
                      </div>
                    </div>

                    <div class="project-links">
                      <a
                        v-if="project.github"
                        :href="project.github"
                        target="_blank"
                        class="link-btn"
                        title="SOURCE CODE"
                      >
                        SRC
                    </a>
                      <a
                        v-if="project.demo"
                        :href="project.demo"
                        target="_blank"
                        class="link-btn primary"
                        title="LIVE DEMO"
                      >
                        DEMO
                    </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Category Filter -->
        <section class="filter-section" v-if="categories.length > 1">
          <div class="section-container">
            <div class="category-filter">
              <button
                v-for="cat in categories"
                :key="cat"
                :class="['filter-btn', { active: activeCategory === cat }]"
                @click="setCategory(cat)"
              >
                [{{ cat }}]
              </button>
            </div>
          </div>
        </section>

        <!-- All Projects Grid -->
        <section class="projects-section">
          <div class="section-container">
            <div class="section-header" v-if="!featuredProjects.length">
              <h2 class="section-title">
                <span class="section-icon">►</span> 项目展示
              </h2>
              <p class="section-subtitle">ALL_PROJECTS // 探索学长学姐们的创意作品</p>
            </div>

            <div class="projects-grid" v-if="filteredProjects.length > 0">
              <div
                v-for="project in filteredProjects"
                :key="project.name"
                class="project-card"
              >
                <div class="card-image">
                  <div class="image-placeholder" v-if="!project.image">
                    <span class="project-icon">{{ project.icon || '📦' }}</span>
                  </div>
                  <img v-else :src="project.image" :alt="project.name" class="project-image" loading="lazy" />
                </div>

                <div class="card-header">
                  <div class="card-category" v-if="project.category">#{{ project.category }}</div>
                </div>

                <h3 class="card-title">{{ project.name }}</h3>
                <p class="card-desc">{{ project.description }}</p>

                <div class="card-techs">
                  <span v-for="tech in project.techs.slice(0, 4)" :key="tech" class="card-tech">
                    {{ tech }}
                  </span>
                  <span v-if="project.techs.length > 4" class="card-tech more">
                    +{{ project.techs.length - 4 }}
                  </span>
                </div>

                <div class="card-footer">
                  <div class="card-author">
                    <span class="author-prefix">by</span>
                    <span>{{ project.author }}</span>
                  </div>

                  <div class="card-links">
                    <a
                      v-if="project.github"
                      :href="project.github"
                      target="_blank"
                      class="card-link"
                      title="Source"
                    >
                      GIT
                    </a>
                    <a
                      v-if="project.demo"
                      :href="project.demo"
                      target="_blank"
                      class="card-link primary"
                      title="Demo"
                    >
                      RUN
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div class="empty-state" v-else>
              <div class="empty-icon">⚠</div>
              <h3 class="empty-title">NO_DATA_FOUND</h3>
              <p class="empty-desc">
                项目数据正在加载或收集中...<br/>
                Waiting for input...
              </p>
            </div>
          </div>
        </section>

        <!-- Call to Action -->
        <section class="cta-section">
          <div class="section-container">
            <div class="cta-card">
              <div class="cta-content">
                <h3 class="cta-title">>> SUBMIT_PROJECT</h3>
                <p class="cta-desc">
                  如果你有优秀的项目想要分享，欢迎提交 PR 或联系协会成员！
                </p>
              </div>
              <a
                href="https://github.com/ECUSTCIC-CodeHub/Dev-Voyage/issues/new"
                target="_blank"
                class="cta-btn"
              >
                INIT_SUBMISSION()
              </a>
            </div>
          </div>
        </section>
      </div>
    </template>
  </Layout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

.projects-container {
  width: 100%;
  min-height: calc(100vh - var(--vp-nav-height));
  background-color: var(--vp-c-bg);
  position: relative;
  overflow: hidden;
  font-family: 'Space Mono', monospace, system-ui;
}

/* Retro Grid Background */
.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(128, 128, 128, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(128, 128, 128, 0.08) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
}

/* Section Container */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

/* Hero Section */
.hero-section {
  padding: 100px 24px 80px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.hero-icon {
  font-size: 64px;
  margin-bottom: 24px;
  display: inline-block;
  filter: drop-shadow(0 0 20px rgba(var(--vp-c-brand-1), 0.5));
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.tech-text {
  background: linear-gradient(180deg, var(--vp-c-text-1) 0%, var(--vp-c-text-2) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.hero-tagline {
  font-size: 20px;
  font-weight: 400;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
  font-family: 'Space Mono', monospace;
}

.prompt {
  color: var(--vp-c-brand-1);
  font-weight: bold;
  margin-right: 8px;
}

.cursor {
  display: inline-block;
  width: 10px;
  height: 20px;
  background-color: var(--vp-c-brand-1);
  animation: blink 1s step-end infinite;
  vertical-align: middle;
  margin-left: 4px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-description {
  font-size: 16px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* Section Header */
.section-header {
  margin-bottom: 40px;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 16px;
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.section-icon {
  color: var(--vp-c-brand-1);
  margin-right: 8px;
}

.section-subtitle {
  font-size: 14px;
  color: var(--vp-c-text-3);
  font-family: 'Space Mono', monospace;
}

/* Featured Section */
.featured-section {
  padding: 40px 0 60px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 32px;
}

.featured-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.2s ease;
}

.featured-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 8px 8px 0 rgba(0,0,0,0.1);
  transform: translate(-2px, -2px);
}

.featured-image {
  height: 240px;
  background: var(--vp-c-bg-soft);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.featured-card:hover .featured-image img {
  transform: scale(1.05);
}

.project-icon {
  font-size: 64px;
  opacity: 0.8;
}

.featured-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--vp-c-brand-1);
  color: white;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
}

.featured-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.project-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-base);
}

.project-year-badge {
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  padding: 2px 8px;
  color: var(--vp-c-text-2);
  font-family: 'Space Mono', monospace;
}

.project-desc {
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 24px;
  flex: 1;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.tech-tag {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  padding: 4px 10px;
  font-size: 12px;
  font-family: 'Space Mono', monospace;
  border: 1px solid transparent;
}

.featured-card:hover .tech-tag {
  border-color: var(--vp-c-divider);
}

.project-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar, .author-avatar-placeholder {
  width: 40px;
  height: 40px;
  border: 1px solid var(--vp-c-divider);
}

.author-avatar-placeholder {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-label {
  font-size: 10px;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.author-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.project-links {
  display: flex;
  gap: 12px;
}

.link-btn {
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  transition: all 0.2s ease;
  font-family: 'Space Mono', monospace;
}

.link-btn:hover {
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  border-color: var(--vp-c-text-1);
}

.link-btn.primary {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

.link-btn.primary:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

/* Filter Section */
.filter-section {
  padding: 20px 0 40px;
}

.category-filter {
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 16px;
}

.filter-btn {
  padding: 6px 12px;
  font-size: 14px;
  font-family: 'Space Mono', monospace;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  color: var(--vp-c-brand-1);
}

.filter-btn.active {
  color: var(--vp-c-brand-1);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Projects Grid */
.projects-section {
  padding: 20px 0 80px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.project-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  padding: 24px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  position: relative;
}

.project-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
  box-shadow: 4px 4px 0 rgba(0,0,0,0.1);
}

.card-image {
  height: 160px;
  background: var(--vp-c-bg-soft);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--vp-c-divider);
  margin: -24px -24px 16px -24px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.project-card:hover .card-image img {
  transform: scale(1.05);
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card-category {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-family: 'Space Mono', monospace;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  font-family: var(--vp-font-family-base);
}

.card-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
}

.card-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}

.card-tech {
  font-size: 11px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  font-family: 'Space Mono', monospace;
}

.card-tech.more {
  color: var(--vp-c-brand-1);
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.card-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.author-prefix {
  color: var(--vp-c-text-3);
  font-weight: 400;
  font-family: 'Space Mono', monospace;
}

.card-links {
  display: flex;
  gap: 12px;
}

.card-link {
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: all 0.2s ease;
  font-family: 'Space Mono', monospace;
}

.card-link:hover {
  color: var(--vp-c-brand-1);
}

.card-link.primary {
  color: var(--vp-c-brand-1);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 24px;
  border: 1px dashed var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  font-family: 'Space Mono', monospace;
}

.empty-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  font-family: 'Space Mono', monospace;
}

/* CTA Section */
.cta-section {
  padding: 0 0 80px;
}

.cta-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-brand-1);
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  position: relative;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
  bottom: 4px;
  border: 1px solid var(--vp-c-divider);
  pointer-events: none;
}

.cta-content {
  flex: 1;
  z-index: 1;
}

.cta-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  font-family: 'Space Mono', monospace;
}

.cta-desc {
  font-size: 16px;
  color: var(--vp-c-text-2);
}

.cta-btn {
  padding: 12px 24px;
  background: var(--vp-c-brand-1);
  color: white;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-family: 'Space Mono', monospace;
  z-index: 1;
  box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
}

.cta-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 rgba(0,0,0,0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }

  .featured-grid {
    grid-template-columns: 1fr;
  }

  .featured-card {
    min-width: auto;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .cta-card {
    flex-direction: column;
    text-align: center;
    padding: 32px 24px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>