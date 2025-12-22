<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '>> BROWSE_MORE',
  description: '探索更多精彩内容，发现更多学习资源！',
  buttonText: 'GO_HOME()',
  buttonLink: '/'
})
</script>

<template>
  <section class="cta-section">
    <div class="cta-card">
      <div class="cta-content">
        <h3 class="cta-title">{{ title }}</h3>
        <p class="cta-desc">{{ description }}</p>
      </div>
      <RouterLink :to="buttonLink" class="cta-btn">
        {{ buttonText }}
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.cta-section {
  padding: 0 0 80px;
  width: 100%;
  box-sizing: border-box;
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
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
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
  min-width: 250px;
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

@media (max-width: 768px) {
  .cta-card {
    flex-direction: column;
    text-align: center;
    padding: 32px 24px;
  }
}
</style>