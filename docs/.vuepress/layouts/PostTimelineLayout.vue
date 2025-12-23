<script setup lang="ts">
import { Layout } from 'vuepress-theme-plume/client'
import { usePageData, usePageFrontmatter } from 'vuepress/client'
import { ref, onMounted, computed } from 'vue'
import CTASection from '../components/CTASection.vue'
import { RouterLink } from 'vue-router'

// 定义帖子类型接口
interface Post {
  title: string
  date: string
  updateTime?: string
  author?: string
  excerpt?: string
  path: string
  icon?: string
  image?: string
  category?: string
  featured?: boolean
}

// 定义时间线配置接口
interface TimelineConfig {
  title?: string
  posts?: Post[]
  jsonFile?: string
  autoDetect?: boolean
  hero?: {
    name?: string
    tagline?: string
    description?: string
  }
}

const frontmatter = usePageFrontmatter<{
  config?: TimelineConfig
  timelineJsonFile?: string
}>()
const page = usePageData()

// 时间线数据状态
const timelineData = ref({
  title: '文章时间线',
  posts: [] as Post[]
})

// 加载状态
const loading = ref(true)

// 错误信息
const error = ref('')

// 获取英雄配置
const hero = computed(() => frontmatter.value.config?.hero || {})

// 精选文章
const featuredPosts = computed(() => timelineData.value.posts.filter(p => p.featured))

// 分类列表
const categories = computed(() => {
  const cats = new Set(timelineData.value.posts.map(p => p.category).filter(Boolean))
  return ['全部', ...Array.from(cats)]
})

const activeCategory = ref('全部')

// 筛选后的文章
const filteredPosts = computed(() => {
  if (activeCategory.value === '全部') {
    return timelineData.value.posts
  }
  return timelineData.value.posts.filter(p => p.category === activeCategory.value)
})

// 设置分类
function setCategory(cat: string) {
  activeCategory.value = cat
}

// 格式化日期
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch (error) {
    return dateString
  }
}

// 带重试机制的加载函数
const loadWithRetry = async (url: string, retryCount = 2, delay = 1000): Promise<Response> => {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      console.log(`尝试加载数据 (第 ${attempt} 次):`, url)
      const response = await fetch(url)
      
      if (response.ok) {
        // 检查响应内容是否为有效的JSON
        const text = await response.text()
        try {
          JSON.parse(text)
          console.log(`第 ${attempt} 次尝试成功，响应是有效的JSON`)
          // 重新创建Response对象，因为text()方法会消耗响应体
          return new Response(text, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          })
        } catch (jsonError) {
          console.warn(`第 ${attempt} 次尝试失败，响应不是有效的JSON:`, jsonError)
          // 如果不是最后一次尝试，等待后重试
          if (attempt < retryCount) {
            console.log(`等待 ${delay}ms 后重试...`)
            await new Promise(resolve => setTimeout(resolve, delay))
            delay *= 1.5
            continue
          }
          throw new Error(`响应不是有效的JSON: ${text.substring(0, 100)}...`)
        }
      }
      
      console.warn(`第 ${attempt} 次尝试失败，状态码:`, response.status)
      
      // 如果不是最后一次尝试，等待后重试
      if (attempt < retryCount) {
        console.log(`等待 ${delay}ms 后重试...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        // 每次重试后增加延迟时间
        delay *= 1.5
      }
    } catch (err) {
      console.error(`第 ${attempt} 次尝试出错:`, err)
      if (attempt < retryCount) {
        console.log(`等待 ${delay}ms 后重试...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        delay *= 1.5
      }
    }
  }
  
  throw new Error(`所有 ${retryCount} 次尝试都失败了`)
}

// 加载时间线数据
const loadTimelineData = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const config = frontmatter.value.config || {}
    const fmJsonFile = frontmatter.value.timelineJsonFile
    
    // 情况1: 直接在 config 中提供 posts 数据
    if (config.posts && config.posts.length > 0) {
      timelineData.value = {
        title: config.title || '文章时间线',
        posts: config.posts
      }
      loading.value = false
      return
    }
    
    // 情况2: 使用 config.jsonFile 或 frontmatter.timelineJsonFile
    let jsonFileName = config.jsonFile || fmJsonFile
    
    // 情况3: 自动检测
    if (!jsonFileName && config.autoDetect !== false) {
      const path = page.value.path
      if (path.includes('/post/')) {
        jsonFileName = 'tech-posts.json'
      } else if (path.includes('/fullstack-course/')) {
        jsonFileName = 'fullstack-course.json'
      } else {
        const baseName = path.replace(/\//g, '-').replace(/^-|-$/g, '')
        jsonFileName = `${baseName || 'timeline'}.json`
      }
    }
    
    // 情况4: 默认回退
    if (!jsonFileName) {
      jsonFileName = 'timeline.json'
    }
    
    // 构建完整的 JSON URL，从 VuePress 配置获取 base
    const jsonUrl = `timelines/${jsonFileName}`
    console.log('加载时间线数据:', jsonUrl)
    
    let try_again = false;
    let data: any = null;
    
    try {
      // 第一次尝试：使用原始URL路径
      const response = await loadWithRetry(jsonUrl)
      data = await response.json()
      console.log('第一次尝试成功，加载数据:', data)
    } catch (firstError) {
      console.log('第一次尝试失败，尝试使用 /Dev-Voyage 前缀重试:', firstError)
      try_again = true;
      
      // 第二次尝试：使用 /Dev-Voyage 前缀
      const devVoyageUrl = `/Dev-Voyage/timelines/${jsonFileName}`
      console.log('重试 URL:', devVoyageUrl)
      
      const retryResponse = await loadWithRetry(devVoyageUrl)
      if (!retryResponse.ok) {
        throw new Error(`无法加载时间线数据: ${retryResponse.status}`)
      }
      
      data = await retryResponse.json()
      console.log('使用 /Dev-Voyage 前缀重试成功，加载数据:', data)
    }
    
    // 处理图片路径
    if (data && data.posts) {
      data.posts.forEach((post: any) => {
        if (post.image && !post.image.startsWith('http') && try_again) {
          post.image = `/Dev-Voyage/${post.image}`
        }
      })
      timelineData.value = data
      console.log('最终时间线数据:', timelineData.value)
    } else {
      throw new Error('加载的数据格式不正确')
    }
    
  } catch (err) {
    console.error('加载时间线数据失败:', err)
    error.value = err instanceof Error ? err.message : '加载失败'
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadTimelineData()
})
</script>

<template>
  <Layout>
    <template #custom-content>
      <div class="timeline-container">
        <!-- Retro Grid Background -->
        <div class="bg-grid" aria-hidden="true"></div>
        
        <!-- Hero Section -->
        <section class="hero-section" v-if="hero.name || hero.tagline || hero.description">
          <div class="hero-content">
            <div class="hero-decoration-top"></div>
            <h1 class="hero-title" v-if="hero.name">
              <span class="tech-text">{{ hero.name }}</span>
            </h1>
            <p class="hero-tagline" v-if="hero.tagline">
              <span class="prompt">></span> {{ hero.tagline }} <span class="cursor">_</span>
            </p>
            <p class="hero-description" v-if="hero.description">{{ hero.description }}</p>
          </div>
        </section>

        <!-- Loading State -->
        <section v-if="loading" class="status-section">
          <div class="section-container">
            <div class="loading-state">
              <div class="loading-spinner"></div>
              <p class="loading-text">INITIALIZING_DATA()...</p>
            </div>
          </div>
        </section>

        <!-- Error State -->
        <section v-else-if="error" class="status-section">
          <div class="section-container">
            <div class="error-state">
              <div class="error-icon">⚠</div>
              <h3 class="error-title">ERROR: {{ error }}</h3>
              <p class="error-desc">Failed to load timeline data</p>
            </div>
          </div>
        </section>

        <!-- Featured Posts Section -->
        <section class="featured-section" v-if="featuredPosts.length > 0 && !loading && !error">
          <div class="section-container">
            <div class="section-header">
              <h2 class="section-title">
                <span class="section-icon">★</span> 精选文章
              </h2>
              <p class="section-subtitle">FEATURED_POSTS // 值得重点关注的内容</p>
            </div>

            <div class="featured-grid">
              <div
                v-for="post in featuredPosts"
                :key="post.path"
                class="featured-card"
              >
                <div class="featured-image">
                  <div class="image-placeholder">
                    <!-- 优先显示图片，如果没有图片则显示图标 -->
                    <img 
                      v-if="post.image" 
                      :src="post.image" 
                      :alt="post.title"
                      class="post-image"
                      loading="lazy"
                    />
                    <span v-else class="post-icon">{{ post.icon || '📝' }}</span>
                  </div>
                  <div class="featured-badge">FEATURED</div>
                </div>

                <div class="featured-content">
                  <div class="content-header">
                    <h3 class="post-name">{{ post.title }}</h3>
                    <div class="post-year-badge">{{ formatDate(post.date) }}</div>
                  </div>
                  
                  <p class="post-desc" v-if="post.excerpt">{{ post.excerpt }}</p>

                  <div class="post-tags">
                    <span v-if="post.category" class="post-tag">
                      {{ post.category }}
                    </span>
                    <span v-if="post.author" class="post-tag">
                      {{ post.author }}
                    </span>
                  </div>

                  <div class="post-footer">
                    <div class="post-meta">
                      <span class="meta-label">DATE</span>
                      <span class="meta-value">{{ formatDate(post.date) }}</span>
                      <span v-if="post.updateTime && post.updateTime !== post.date" class="meta-value">
                        UPDATE: {{ formatDate(post.updateTime) }}
                      </span>
                    </div>

                    <div class="post-links">
                      <RouterLink :to="post.path" target="_self" class="link-btn primary" title="READ_ARTICLE">
                        READ
                      </RouterLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Category Filter -->
        <section class="filter-section" v-if="categories.length > 1 && !loading && !error">
          <div class="section-container">
            <div class="category-filter">
              <button
                v-for="cat in categories"
                :key="cat"
                :class="['filter-btn', { active: activeCategory === cat }]"
                @click="setCategory(cat as string)"
              >
                [{{ cat }}]
              </button>
            </div>
          </div>
        </section>

        <!-- All Posts Timeline -->
        <section class="timeline-section" v-if="!loading && !error">
          <div class="section-container">
            <div class="section-header" v-if="!featuredPosts.length">
              <h2 class="section-title">
                <span class="section-icon">►</span> 文章时间线
              </h2>
              <p class="section-subtitle">ALL_POSTS // 按时间顺序排列的所有文章</p>
            </div>

            <div class="timeline" v-if="filteredPosts.length > 0">
              <RouterLink
                v-for="post in filteredPosts"
                :key="post.path"
                :to="post.path"
                class="timeline-item-link"
              >
                <div class="timeline-item">
                  <div class="timeline-icon">
                    <!-- 优先显示图片，如果没有图片则显示图标 -->
                    <img 
                      v-if="post.image" 
                      :src="post.image" 
                      :alt="post.title"
                      class="timeline-image"
                    />
                    <span v-else class="timeline-post-icon">{{ post.icon || '📝' }}</span>
                  </div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <h3 class="timeline-title">
                        <span class="post-link">{{ post.title }}</span>
                      </h3>
                      <span class="timeline-date">{{ formatDate(post.date) }}</span>
                    </div>
                    
                    <div class="timeline-meta">
                      <span v-if="post.category" class="meta-badge">
                        #{{ post.category }}
                      </span>
                      <span v-if="post.author" class="meta-badge">
                        @{{ post.author }}
                      </span>
                      <span v-if="post.updateTime && post.updateTime !== post.date" class="meta-badge">
                        更新: {{ formatDate(post.updateTime) }}
                      </span>
                    </div>

                    <p class="timeline-excerpt" v-if="post.excerpt">
                      {{ post.excerpt }}
                    </p>
                  </div>
                </div>
              </RouterLink>
            </div>

            <!-- Empty State -->
            <div class="empty-state" v-else>
              <div class="empty-icon">📭</div>
              <h3 class="empty-title">NO_POSTS_FOUND</h3>
              <p class="empty-desc">
                暂无符合要求的文章<br/>
                Waiting for content...
              </p>
            </div>
          </div>
        </section>

        <!-- Call to Action -->
        <CTASection title="YOUR_OPION"
          description="来提交你的文章吧 ~ 我们期待你的精彩内容！"
          buttonText="SUBMIT_ARTICLE()"
          button-link="https://github.com/ECUSTCIC-CodeHub/Dev-Voyage/issues/new" v-if="!loading && !error" />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

.timeline-container {
  height: 100%;
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

/* Status States */
.status-section {
  padding: 40px 0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 80px 24px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  margin: 0 auto 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: var(--vp-c-text-2);
  font-family: 'Space Mono', monospace;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-danger);
  margin-bottom: 8px;
  font-family: 'Space Mono', monospace;
}

.error-desc {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

/* Featured Section */
.featured-section {
  padding: 40px 0;
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

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--vp-c-bg-soft) 0%, var(--vp-c-bg-mute) 100%);
}

.post-icon {
  font-size: 64px;
  opacity: 0.8;
}

/* 图片样式 */
.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-card:hover .post-image {
  transform: scale(1.05);
}

/* 时间线图标区域 */
.timeline-icon {
  position: absolute;
  left: -3.5rem;
  top: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  overflow: hidden;
}

.timeline-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.timeline-post-icon {
  font-size: 1.2rem;
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
  gap: 16px;
}

.post-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-base);
  flex: 1;
}

.post-year-badge {
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  padding: 4px 8px;
  color: var(--vp-c-text-2);
  font-family: 'Space Mono', monospace;
  white-space: nowrap;
}

.post-desc {
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 20px;
  flex: 1;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.post-tag {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  padding: 4px 10px;
  font-size: 11px;
  font-family: 'Space Mono', monospace;
  border: 1px solid transparent;
}

.featured-card:hover .post-tag {
  border-color: var(--vp-c-divider);
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid var(--vp-c-divider);
  gap: 16px;
  flex-wrap: wrap;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  font-size: 11px;
  font-family: 'Space Mono', monospace;
}

.meta-label {
  color: var(--vp-c-text-3);
  font-weight: 700;
}

.meta-value {
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  padding: 2px 6px;
  border-radius: 2px;
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

/* Timeline Section */
.timeline-section {
  padding: 20px 0 40px;
}

.timeline {
  position: relative;
  padding-left: 2rem;
  border-left: 2px solid var(--vp-c-divider);
  margin-left: 1rem;
}

.timeline-item-link {
  display: block;
  text-decoration: none;
  color: inherit;
  margin-bottom: 3rem;
}

.timeline-item {
  position: relative;
  padding-left: 2rem;
  transition: all 0.2s ease;
}

.timeline-item-link:hover .timeline-item {
  transform: translate(-2px, -2px);
}

.timeline-item-link:hover .timeline-content {
  border-color: var(--vp-c-brand-1);
  box-shadow: 4px 4px 0 rgba(0,0,0,0.1);
  transform: translate(-2px, -2px);
}

.timeline-item-link:active .timeline-content {
  transform: translate(-1px, -1px);
}

.timeline-content {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  padding: 20px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.timeline-item-link:hover .timeline-content {
  border-color: var(--vp-c-brand-1);
  box-shadow: 4px 4px 0 rgba(0,0,0,0.1);
  transform: translate(-2px, -2px);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;
  flex-wrap: wrap;
}

.timeline-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  min-width: 200px;
}

.post-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s ease;
}

.post-link:hover {
  color: var(--vp-c-brand-1);
}

.timeline-date {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-family: 'Space Mono', monospace;
  white-space: nowrap;
}

.timeline-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.meta-badge {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  padding: 3px 8px;
  font-size: 11px;
  font-family: 'Space Mono', monospace;
  border-radius: 2px;
}

.timeline-excerpt {
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
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

  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .timeline-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .post-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>