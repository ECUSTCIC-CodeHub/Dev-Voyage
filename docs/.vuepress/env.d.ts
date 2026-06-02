/// <reference types="vite/client" />

// Vite 客户端类型会为 *.css、*.svg、*.png 等静态资源以及 *.vue 单文件组件
// 提供模块声明，从而让 TypeScript 正确识别 side-effect 导入（如 `import 'x.css'`）。
// 解决 [ts-plugin] 错误 2882:
//   "Cannot find module or type declarations for side-effect import of '.../*.css'"

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
