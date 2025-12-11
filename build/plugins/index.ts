import type { PluginOption } from "vite"
import { createVuePlugin } from "./vue"
import { createAutoImport } from "./auto-import"
import { createComponents } from "./components"
import { createDevTools } from "./devtools"
import { createBuildInfo } from "./build-info"

/**
 * 插件配置选项
 */
export interface PluginOptions {
  /** 是否为开发模式 */
  isDev: boolean
}

/**
 * 创建所有 Vite 插件
 * @param options 插件配置选项
 * @returns 插件数组
 */
export function createVitePlugins(options: PluginOptions): PluginOption[] {
  const { isDev } = options

  return [
    // Vue 核心插件
    createVuePlugin(),
    // Vue DevTools - 仅开发模式
    isDev && createDevTools(),
    // 构建信息插件
    ...createBuildInfo(),
    // 自动导入 API
    createAutoImport(),
    // 组件自动注册
    createComponents(),
  ].filter(Boolean) as PluginOption[]
}

// 导出各个插件创建函数，方便单独使用
export { createVuePlugin } from "./vue"
export { createAutoImport } from "./auto-import"
export { createComponents } from "./components"
export { createDevTools } from "./devtools"
export { createBuildInfo } from "./build-info"
