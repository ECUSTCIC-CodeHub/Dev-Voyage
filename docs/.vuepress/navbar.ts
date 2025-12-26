/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '🏠首页', link: '/' },
  { text: '🚀全栈教程', link: 'fullstack-course/' },
  { text: '🤖AI教程', link: 'amadeus-gate/' },
  { text: '🔧基础教程', link: 'essential/' },
  { text: '👨‍💻学长的项目', link: 'projects/' },
  { text: '📰推送', link: 'post/' },
])
