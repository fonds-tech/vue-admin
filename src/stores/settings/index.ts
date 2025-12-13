import type { MenuStyle, MenuLayout, ThemeStyle, SettingsState } from "./types"
import { defineStore } from "pinia"

// ==================== Store 定义 ====================

export const useSettingsStore = defineStore("settings", {
  state: (): SettingsState => ({
    // 菜单设置
    menuWidth: 220,
    menuCollapsedWidth: 62,
    menuLayout: "dual",
    menuStyle: "light",
    // 主题设置
    themeStyle: "light",
    primaryColor: "#6366f1",
  }),

  getters: {
    /** 当前菜单是否为暗色风格 */
    isMenuDark: (state) => state.menuStyle === "dark",

    /** 当前主题是否为暗色 */
    isThemeDark: (state) => state.themeStyle === "dark",

    /** 是否使用垂直菜单布局 */
    isVerticalLayout: (state) => state.menuLayout === "vertical",

    /** 是否使用水平菜单布局 */
    isHorizontalLayout: (state) => state.menuLayout === "horizontal",

    /** 是否使用混合菜单布局 */
    isMixedLayout: (state) => state.menuLayout === "mixed",

    /** 是否使用双列菜单布局 */
    isDualLayout: (state) => state.menuLayout === "dual",
  },

  actions: {
    // ========== 菜单设置 ==========

    /** 设置菜单宽度 */
    setMenuWidth(width: number) {
      this.menuWidth = width
    },

    /** 设置折叠后菜单宽度 */
    setMenuCollapsedWidth(width: number) {
      this.menuCollapsedWidth = width
    },

    /** 设置菜单布局模式 */
    setMenuLayout(layout: MenuLayout) {
      this.menuLayout = layout
    },

    /** 设置菜单风格 */
    setMenuStyle(style: MenuStyle) {
      this.menuStyle = style
    },

    // ========== 主题设置 ==========

    /** 设置主题风格 */
    setThemeStyle(style: ThemeStyle) {
      this.themeStyle = style
    },

    /** 设置主题色 */
    setPrimaryColor(color: string) {
      this.primaryColor = color
      this.applyPrimaryColor(color)
    },

    /** 应用主题色到 CSS 变量 */
    applyPrimaryColor(color: string) {
      document.documentElement.style.setProperty("--el-color-primary", color)
    },

    // ========== 通用操作 ==========

    /** 重置为默认设置 */
    resetSettings() {
      this.menuWidth = 220
      this.menuCollapsedWidth = 62
      this.menuLayout = "vertical"
      this.menuStyle = "light"
      this.themeStyle = "light"
      this.primaryColor = "#6366f1"
    },

    /** 初始化设置（应用启动时调用） */
    initSettings() {
      // 应用主题色
      this.applyPrimaryColor(this.primaryColor)
    },
  },

  // 持久化配置
  persist: {
    key: "settings-store",
    pick: ["menuWidth", "menuCollapsedWidth", "menuLayout", "menuStyle", "themeStyle", "primaryColor"],
  },
})
