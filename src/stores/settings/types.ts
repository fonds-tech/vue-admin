/**
 * 设置状态类型定义
 */

// ==================== 菜单相关类型 ====================

/** 菜单布局模式 */
export type MenuLayout = "vertical" | "horizontal" | "mixed" | "dual"

/** 菜单风格 */
export type MenuStyle = "light" | "dark" | "transparent"

// ==================== 主题相关类型 ====================

/** 主题风格 */
export type ThemeStyle = "light" | "dark" | "auto"

// ==================== 状态接口 ====================

/** 设置状态 */
export interface SettingsState {
  // ========== 菜单设置 ==========

  /** 菜单宽度（px） */
  menuWidth: number
  /** 折叠后菜单宽度（px） */
  menuCollapsedWidth: number
  /** 菜单布局模式 */
  menuLayout: MenuLayout
  /** 菜单风格 */
  menuStyle: MenuStyle

  // ========== 主题设置 ==========

  /** 主题风格 */
  themeStyle: ThemeStyle
  /** 主题色（十六进制） */
  primaryColor: string
}
