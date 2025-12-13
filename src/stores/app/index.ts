/**
 * 应用状态管理（选项式）
 */
import type { AppState, MenuMode, TransitionName } from "./types"
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
    toggleTheme(event?: MouseEvent) {
      this.theme = this.theme === "light" ? "dark" : "light"
      this.applyThemeToDOM(this.theme, event)
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
    setTheme(mode: "light" | "dark", event?: MouseEvent) {
      this.theme = mode
      this.applyThemeToDOM(mode, event)
    },

    /** 初始化主题（应用启动时调用，不触发动画） */
    initTheme() {
      const html = document.documentElement
      html.classList.toggle("dark", this.theme === "dark")
      html.setAttribute("data-theme", this.theme)
    },

    /**
     * 将主题应用到 DOM（支持圆形扩散动画）
     * 使用 View Transitions API 实现 Element Plus 官网风格的主题切换效果
     */
    applyThemeToDOM(mode: "light" | "dark", event?: MouseEvent) {
      const html = document.documentElement
      const isDark = mode === "dark"

      // 如果浏览器不支持 View Transitions API，直接切换
      if (!document.startViewTransition) {
        html.classList.toggle("dark", isDark)
        html.setAttribute("data-theme", mode)
        return
      }

      // 获取点击位置，作为动画的圆心
      const x = event?.clientX ?? window.innerWidth / 2
      const y = event?.clientY ?? window.innerHeight / 2

      // 计算到最远角落的距离，作为动画的最终半径
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      )

      // 启动 View Transition
      const transition = document.startViewTransition(() => {
        html.classList.toggle("dark", isDark)
        html.setAttribute("data-theme", mode)
      })

      // 等待动画就绪后执行
      transition.ready.then(() => {
        // 始终使用新视图进行动画，避免层级切换导致的闪烁
        // 切换到暗色：新视图从点击处扩散
        // 切换到亮色：新视图从点击处扩散（像打开手电筒一样）
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 400,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          },
        )
      })
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
