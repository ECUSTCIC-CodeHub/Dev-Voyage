---
title: 全栈培训课程
createTime: 2025/11/13 20:43:53
permalink: /fullstack-course/index/
---

# 全栈培训课程


::: important
目前课程大部分内容已完成，后续我们会继续更新以解决一些小错误。

如果你发现任何问题或有建议，欢迎提出 [Issue](https://github.com/ECUSTCIC-CodeHub/Dev-Voyage/issues/new) 或 [PR](https://github.com/ECUSTCIC-CodeHub/Dev-Voyage/pulls)。

另外，==招募一位站长==。如果有兴趣，欢迎联系我们。
:::


::: tip 项目驱动，边做边学
本课程采用**项目驱动**的教学方式——我们不会先讲一堆概念再写代码，而是直接动手做项目，在实践中逐步理解原理。

每一章你都能看到**可见的成果**，从第一天的 Hello World，到最后把网站部署上线，你会亲眼见证自己的项目一步步变得成熟。

传统教学 vs 项目驱动教学

| 传统方式 ❌ | 项目驱动 ✅ |
|------------|------------|
| 先学概念，再写代码 | 先写代码，在实践中理解概念 |
| 学完前端再学后端 | 前后端同步推进，完整体验 |
| 一开始就讲完所有规范 | 基础规范先做，复杂规范后说 |
| 理论→实践 | 实践→理论→更深实践 |

学习曲线设计

<svg width="500" height="250" xmlns="http://www.w3.org/2000/svg" style="--axis-color: #888; --text-color: #888; --secondary-color: #888;">
  
  <!-- 坐标轴 -->
  <line x1="50" y1="30" x2="50" y2="200" stroke="var(--axis-color)" stroke-width="1"/>
  <line x1="50" y1="200" x2="450" y2="200" stroke="var(--axis-color)" stroke-width="1"/>
  
  <!-- Y轴标签 -->
  <text x="25" y="25" font-family="monospace" font-size="14" fill="var(--text-color)">兴趣 📈</text>
  
  <!-- 垂直线 -->
  <line x1="50" y1="30" x2="50" y2="200" stroke="var(--axis-color)" stroke-width="1"/>
  
  <!-- 学习曲线 - 斜线上升 -->
  <line x1="50" y1="200" x2="150" y2="50" stroke="var(--axis-color)" stroke-width="1"/>
  
  <!-- 学习曲线 - 水平线 -->
  <line x1="150" y1="50" x2="450" y2="50" stroke="var(--axis-color)" stroke-width="1"/>
  
  <!-- 注释文字 -->
  <text x="300" y="70" font-family="monospace" font-size="10" fill="var(--secondary-color)" text-anchor="middle">持续看到项目成长，保持动力</text>
  
  <text x="100" y="170" font-family="monospace" font-size="10" fill="var(--secondary-color)" text-anchor="middle">快速出成果</text>
  <text x="100" y="185" font-family="monospace" font-size="8" fill="var(--secondary-color)" text-anchor="middle">第1天就能看到页面！</text>
  
  <!-- X轴标签 -->
  <text x="450" y="220" font-family="monospace" font-size="12" fill="var(--text-color)" text-anchor="end">时间</text>
  
  <!-- 箭头 -->
  <polygon points="455,200 445,195 445,205" fill="var(--axis-color)"/>
</svg>

:::

## 第一阶段：快速起步

> 🎯 目标：搭建环境，快速看到第一个全栈页面

### [第 0 章：前置知识](./0.md)

- 讲义信息框说明
- 提问的智慧与 STFW/RTFM/RTFSC
- 独立解决问题的能力培养
- 如何更好地学习
- 🎉 **成果：独立解决问题的能力！**

### [第 1 章：全栈开发导论](./1.md)

- 什么是全栈开发与前后端分离
- 我们要做什么项目
- Nuxt.js 与 FastAPI 技术栈简介
- 学习路线图
- 🎉 **成果：了解课程目标和技术栈！**

### [第 2 章：开发环境搭建](./2.md)

- Node.js 与 pnpm 安装配置
- Python 与 PDM 安装配置
- VS Code 及必要插件
- Git 版本控制基础
- 🎉 **成果：开发环境搭建完成！**

### [第 3 章：第一个全栈页面](./3.md)

- 创建 Nuxt 前端项目
- 创建 FastAPI 后端项目
- 前端 Hello World 页面
- 后端 Hello World API
- 🎉 **成果：前后端联通，页面显示后端数据！**

### [第 4 章：让页面动起来](./4.md)

- Vue 响应式基础（边做边学）
- 按钮点击获取数据
- 加载状态和错误处理
- Vibe Coding 与 AI 辅助编程
- 🎉 **成果：交互式页面！**

### [第 5 章：个人主页开发](./5.md)

- 页面布局（Header/Main/Footer）
- 组件拆分与复用
- Tailwind CSS 快速上手
- Tailwind CSS 优缺点与原生 CSS 混合使用
- 创建 Hero、技能、项目展示组件
- 🎉 **成果：漂亮的个人主页！**

### [第 6 章：文章列表功能](./6.md)

- Nuxt 文件路由
- 后端文章列表 API
- 前端展示文章列表
- 🎉 **成果：博客列表页！**

### [第 7 章：文章详情与数据库](./7.md)

- SQLite 数据库入门
- SQLAlchemy 模型（照着写）
- 动态路由与文章详情
- 🎉 **成果：点击查看文章详情，数据持久化！**

### [第 8 章：发布文章功能](./8.md)

- Markdown 编辑器
- 表单与数据验证
- POST 请求发布文章
- 🎉 **成果：能发布新文章了！**

## 第三阶段：完善系统

> 🎯 目标：添加用户系统和互动功能

### [第 9 章：用户登录注册](./9.md)

- 用户表设计
- 注册与登录功能
- JWT 认证（照着用）
- 🎉 **成果：用户系统上线！**

### [第 10 章：权限与个人中心](./10.md)

- Pinia 状态管理
- 路由守卫
- 个人中心页面
- 🎉 **成果：登录后才能发文章！**

### [第 11 章：评论与互动](./11.md)

- 评论表设计
- 评论列表与发表
- 评论嵌套（可选）
- 🎉 **成果：文章可以评论了！**

## 第四阶段：打磨上线

> 🎯 目标：让项目更专业，部署到互联网

### [第 12 章：样式美化与响应式](./12.md)

- Nuxt UI 组件库
- 暗黑模式
- 移动端适配
- 🎉 **成果：网站变好看了！**

### [第 13 章：性能优化与规范回顾](./13.md)

- 代码规范详解（现在来讲"为什么"）
- 项目结构最佳实践
- 性能优化技巧
- 🎉 **成果：代码更专业了！**

### [第 14 章：部署上线](./14.md)

- Docker 容器化
- 云服务器部署
- GitHub Actions CI/CD
- 🎉 **成果：网站上线了！发给朋友看！**