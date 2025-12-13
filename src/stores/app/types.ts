/**
 * 应用状态类型定义
 */

/** 菜单显示模式 */
export type MenuMode = "accordion" | "expand" | "collapse"

/** 过渡动画类型 */
export type TransitionName = "fade" | "slide" | "zoom" | "none"

/** 主题类型 */
export type ThemeType = "light" | "dark"

/** 语言类型 */
export type LanguageType = "zh-CN" | "en-US"

export interface AppState {
  /** 侧边栏是否折叠 */
  sidebarCollapsed: boolean
  /** 当前语言 */
  language: string
  /** 当前主题 */
  theme: ThemeType
  /** 是否显示进程标签栏 */
  showProcess: boolean
  /** 是否显示水印 */
  showWatermark: boolean
  /** 是否固定顶栏 */
  fixedHeader: boolean
  /** 菜单显示模式 */
  menuMode: MenuMode
  /** 过渡动画 */
  transition: TransitionName
}
