import type { MenuMode, MenuStyle, MenuLayout, ThemeStyle, LanguageType, TransitionName } from "./types"
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

    /** 当前主题是否为亮色 */
    isThemeLight: (state) => state.themeStyle === "light",

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

    /** 设置菜单显示模式 */
    setMenuMode(mode: MenuMode) {
      this.menuMode = mode
    },

    // ========== 主题设置 ==========

    /** 设置主题风格 */
    setThemeStyle(style: ThemeStyle) {
      this.themeStyle = style
    },

    /** 设置主题（带 DOM 操作） */
    setTheme(mode: "light" | "dark") {
      this.themeStyle = mode
      this.applyTheme()
    },

    /** 切换主题 */
    toggleTheme() {
      this.themeStyle = this.themeStyle === "light" ? "dark" : "light"
      this.applyTheme()
    },

    /** 应用主题到 DOM */
    applyTheme() {
      const html = document.documentElement
      html.classList.toggle("dark", this.themeStyle === "dark")
      html.setAttribute("data-theme", this.themeStyle)
    },

    /** 初始化主题（应用启动时调用，不触发动画） */
    initTheme() {
      this.applyTheme()
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

    // ========== 界面设置 ==========

    /** 设置进程标签栏显示状态 */
    setShowProcess(show: boolean) {
      this.showProcess = show
    },

    /** 切换进程标签栏显示状态 */
    toggleProcess() {
      this.showProcess = !this.showProcess
    },

    /** 设置水印显示状态 */
    setShowWatermark(show: boolean) {
      this.showWatermark = show
    },

    /** 设置固定顶栏 */
    setFixedHeader(fixed: boolean) {
      this.fixedHeader = fixed
    },

    /** 设置过渡动画 */
    setTransition(transition: TransitionName) {
      this.transition = transition
    },

    // ========== 语言设置 ==========

    /** 设置语言 */
    setLanguage(lang: LanguageType) {
      this.language = lang
    },

    // ========== 设置抽屉 ==========

    /** 打开设置抽屉 */
    openSettingsDrawer() {
      this.settingsDrawerOpened = true
    },

    /** 关闭设置抽屉 */
    closeSettingsDrawer() {
      this.settingsDrawerOpened = false
    },

    /** 切换设置抽屉状态 */
    toggleSettingsDrawer() {
      this.settingsDrawerOpened = !this.settingsDrawerOpened
    },

    // ========== 通用操作 ==========

    /** 重置为默认设置 */
    resetSettings() {
      this.$patch({ ...SETTING_CONFIG })
    },

    /** 初始化设置（应用启动时调用） */
    initSettings() {
      this.applyPrimaryColor(this.primaryColor)
      this.initTheme()
    },
  },

  // 持久化配置
  persist: {
    key: "settings-store",
    omit: ["settingsDrawerOpened"], // 排除抽屉状态，不缓存
  },
})
