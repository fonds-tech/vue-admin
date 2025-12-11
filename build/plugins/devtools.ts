import VueDevTools from "vite-plugin-vue-devtools"

/**
 * Vue DevTools 插件配置
 * - 仅在开发模式下启用
 * - 提供组件树、状态检查、性能分析等功能
 */
export function createDevTools() {
  return VueDevTools()
}
