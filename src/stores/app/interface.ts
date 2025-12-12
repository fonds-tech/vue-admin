/**
 * 应用状态类型定义
 */

export interface AppState {
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean
  /** 当前语言 */
  language: string
  /** 当前主题 */
  theme: ThemeType
  /** 是否显示进程标签栏 */
  showProcess: boolean
}

export type ThemeType = "light" | "dark"

export type LanguageType = "zh-CN" | "en-US"
