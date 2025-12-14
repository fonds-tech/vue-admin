/**
 * 设置状态类型定义
 */

// ==================== 菜单相关类型 ====================

/** 菜单布局模式 */
export type MenuLayout = "vertical" | "horizontal" | "mixed" | "dual"

/** 菜单风格 */
export type MenuStyle = "light" | "dark" | "transparent"

/** 菜单显示模式 */
export type MenuMode = "accordion" | "expand" | "collapse"

// ==================== 主题相关类型 ====================

/** 主题风格 */
export type ThemeStyle = "light" | "dark" | "auto"

/** 过渡动画类型 */
export type TransitionName = "fade" | "slide" | "zoom" | "none"

// ==================== 语言相关类型 ====================

/** 语言类型 */
export type LanguageType = "zh-CN" | "en-US"

// ==================== 状态接口 ====================

/** 设置状态 */
export interface SettingsState {
  // ========== 菜单设置 ==========

  /** 菜单展开宽度（px） */
  menuExpandWidth: number
  /** 菜单折叠宽度（px） */
  menuCollapseWidth: number
  /** 菜单布局模式 */
  menuLayout: MenuLayout
  /** 菜单风格 */
  menuStyle: MenuStyle
  /** 菜单是否折叠 */
  menuCollapsed: boolean
  /** 菜单显示模式 */
  menuMode: MenuMode

  // ========== 主题设置 ==========

  /** 主题风格 */
  themeStyle: ThemeStyle
  /** 主题色（十六进制） */
  primaryColor: string

  // ========== 界面设置 ==========

  /** 是否显示进程标签栏 */
  showProcess: boolean
  /** 是否显示水印 */
  showWatermark: boolean
  /** 是否固定顶栏 */
  fixedHeader: boolean
  /** 过渡动画 */
  transition: TransitionName

  // ========== 语言设置 ==========

  /** 当前语言 */
  language: LanguageType
}
