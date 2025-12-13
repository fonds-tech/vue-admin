import type { MenuStyle, MenuLayout, ThemeStyle } from "./types"
import { defineStore } from "pinia"
import { SETTING_CONFIG } from "@/config"

// ==================== Store 定义 ====================

export const useSettingsStore = defineStore("settings", {
  state: () => ({ ...SETTING_CONFIG }),

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

    /** 菜单是否折叠 */
    isMenuCollapsed: (state) => state.menuCollapsed,
  },

  actions: {
    // ========== 菜单设置 ==========

    /** 设置菜单展开宽度 */
    setMenuExpandWidth(width: number) {
      this.menuExpandWidth = width
    },

    /** 设置菜单布局模式 */
    setMenuLayout(layout: MenuLayout) {
      this.menuLayout = layout
    },

    /** 设置菜单风格 */
    setMenuStyle(style: MenuStyle) {
      this.menuStyle = style
    },

    /** 切换菜单折叠状态 */
    toggleMenuCollapsed() {
      this.menuCollapsed = !this.menuCollapsed
    },

    /** 设置菜单折叠状态 */
    setMenuCollapsed(collapsed: boolean) {
      this.menuCollapsed = collapsed
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
      this.$patch({ ...SETTING_CONFIG })
    },

    /** 初始化设置（应用启动时调用） */
    initSettings() {
      this.applyPrimaryColor(this.primaryColor)
    },
  },

  // 持久化配置
  persist: {
    key: "settings-store",
  },
})
