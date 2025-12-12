/**
 * 应用状态管理（选项式）
 */
import type { AppState, MenuMode, TransitionName } from "./interface"
import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    sidebarCollapsed: false,
    language: "zh-CN",
    theme: "light",
    showProcess: true,
    showWatermark: false,
    fixedHeader: true,
    menuMode: "accordion",
    transition: "fade",
  }),

  getters: {
    /** 侧边栏宽度 */
    sidebarWidth: state => (state.sidebarCollapsed ? 64 : 220),
  },

  actions: {
    /** 切换侧边栏折叠状态 */
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    /** 设置语言 */
    setLanguage(lang: string) {
      this.language = lang
    },

    /** 切换主题 */
    toggleTheme() {
      this.theme = this.theme === "light" ? "dark" : "light"
      document.documentElement.classList.toggle("dark", this.theme === "dark")
    },

    /** 切换进程标签栏显示状态 */
    toggleProcess() {
      this.showProcess = !this.showProcess
    },

    /** 设置进程标签栏显示状态 */
    setShowProcess(show: boolean) {
      this.showProcess = show
    },

    /** 设置主题 */
    setTheme(mode: "light" | "dark") {
      this.theme = mode
      document.documentElement.classList.toggle("dark", mode === "dark")
    },

    /** 设置水印显示状态 */
    setShowWatermark(show: boolean) {
      this.showWatermark = show
    },

    /** 设置固定顶栏 */
    setFixedHeader(fixed: boolean) {
      this.fixedHeader = fixed
    },

    /** 设置菜单显示模式 */
    setMenuMode(mode: MenuMode) {
      this.menuMode = mode
    },

    /** 设置过渡动画 */
    setTransition(transition: TransitionName) {
      this.transition = transition
    },
  },

  // 持久化配置
  persist: {
    key: "app-store",
    pick: [
      "sidebarCollapsed",
      "language",
      "theme",
      "showProcess",
      "showWatermark",
      "fixedHeader",
      "menuMode",
      "transition",
    ],
  },
})
