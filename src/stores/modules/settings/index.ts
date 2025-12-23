import type { ThemeMode, ThemeToggleOptions } from "@/utils/theme"
import type { UiTheme, MenuMode, MenuStyle, MenuLayout, ThemeStyle, LanguageType, SettingsState, TransitionName } from "./types"
import { watch } from "vue"
import { defineStore } from "pinia"
import { useDeviceStore } from "@/stores/modules/device"
import { applyTheme, toggleTheme as toggleThemeWithAnimation } from "@/utils/theme"

export const useSettingsStore = defineStore("settings", {
  state: (): SettingsState => ({
    /** 菜单展开宽度（px） */
    menuExpandWidth: 250,
    /** 菜单折叠宽度（px） */
    menuCollapseWidth: 52,
    /** 菜单布局模式 */
    menuLayout: "vertical",
    /** 菜单风格 */
    menuStyle: "light",
    /** 菜单是否折叠 */
    menuCollapsed: false,
    /** 菜单显示模式 */
    menuMode: "accordion",
    /** 主题风格 */
    themeStyle: "light",
    /** 界面主题 */
    uiTheme: "aurora",
    /** 主题色 */
    primaryColor: "#6366f1",
    /** 是否显示进程标签栏 */
    showProcess: true,
    /** 是否显示水印 */
    showWatermark: false,
    /** 是否固定顶栏 */
    fixedHeader: true,
    /** 过渡动画 */
    transition: "fade",
    /** 当前语言 */
    language: "zh-CN",
    /** 设置抽屉是否打开 */
    settingsDrawerOpened: false,
    /** 最后使用菜单布局 */
    lastMenuLayout: "vertical",
  }),

  getters: {
    /** 是否为暗色菜单风格 */
    isMenuDark: (state): boolean => state.menuStyle === "dark",

    /** 是否为暗色主题 */
    isThemeDark: (state): boolean => state.themeStyle === "dark",

    /** 是否为亮色主题 */
    isThemeLight: (state): boolean => state.themeStyle === "light",

    /** 是否为垂直布局 */
    isVerticalLayout: (state): boolean => state.menuLayout === "vertical",

    /** 是否为水平布局 */
    isHorizontalLayout: (state): boolean => state.menuLayout === "horizontal",

    /** 是否为混合布局 */
    isMixedLayout: (state): boolean => state.menuLayout === "mixed",

    /** 是否为双列布局 */
    isDualLayout: (state): boolean => state.menuLayout === "dual",

    /** 菜单是否折叠 */
    isMenuCollapsed: (state): boolean => state.menuCollapsed,
  },

  actions: {
    /** 统一初始化入口 */
    initialize() {
      this.initMenuLayout()
      this.initPrimaryColor()
      this.initThemeSettings()
      this.initUiTheme()
    },

    /**
     * 初始化菜单布局
     * @description 监听设备类型变化，移动端自动切换为垂直布局，恢复时还原之前的布局
     */
    initMenuLayout() {
      const deviceStore = useDeviceStore()

      watch(
        () => deviceStore.isMobile,
        (isMobile, wasMobile) => {
          if (isMobile && !wasMobile) {
            if (this.menuLayout !== "vertical") {
              this.lastMenuLayout = this.menuLayout
              this.menuLayout = "vertical"
            }
          } else if (!isMobile && wasMobile) {
            if (this.lastMenuLayout) {
              this.menuLayout = this.lastMenuLayout
            }
          }
        },
        { immediate: true },
      )
    },

    /**
     * 初始化主题色
     * @description 从配置中加载并应用主色
     */
    initPrimaryColor() {
      this.executePrimaryColorApply(this.primaryColor)
    },

    /**
     * 初始化主题设置
     * @description 应用启动时调用，不触发动画
     */
    initThemeSettings() {
      this.executeThemeApply()
    },

    /**
     * 初始化界面主题
     * @description 应用启动时调用，不触发动画
     */
    initUiTheme() {
      this.executeUiThemeApply(this.uiTheme)
    },

    /**
     * 应用主题到 DOM
     * @description 直接执行 CSS 类名切换，不包含动画逻辑
     */
    executeThemeApply() {
      applyTheme(this.themeStyle as ThemeMode)
    },

    /**
     * 应用界面主题到 DOM
     * @param theme - 界面主题
     */
    executeUiThemeApply(theme: UiTheme) {
      document.documentElement.setAttribute("data-ui-theme", theme)
    },

    /**
     * 设置主题风格
     * @param style - 目标主题风格
     * @description 仅更新状态，不触发 DOM 变更
     */
    setThemeStyle(style: ThemeStyle) {
      this.themeStyle = style
    },

    /**
     * 设置界面主题
     * @param theme - 界面主题
     */
    setUiTheme(theme: UiTheme) {
      this.uiTheme = theme
      this.executeUiThemeApply(theme)
    },

    /**
     * 设置主题（带动画）
     * @param mode - 目标模式
     * @param options - 动画配置
     */
    async setTheme(mode: ThemeMode, options?: ThemeToggleOptions) {
      this.themeStyle = mode
      await toggleThemeWithAnimation(mode, options)
    },

    /**
     * 切换主题模式
     * @param options - 动画配置
     */
    async toggleTheme(options?: ThemeToggleOptions) {
      const newTheme: ThemeMode = this.themeStyle === "light" ? "dark" : "light"
      this.themeStyle = newTheme
      await toggleThemeWithAnimation(newTheme, options)
    },

    /**
     * 设置系统主色
     * @param color - 十六进制颜色值
     */
    setPrimaryColor(color: string) {
      this.primaryColor = color
      this.executePrimaryColorApply(color)
    },

    /**
     * 执行主色应用
     * @param color - 颜色值
     */
    executePrimaryColorApply(color: string) {
      document.documentElement.style.setProperty("--el-color-primary", color)
    },

    /**
     * 设置菜单布局
     * @param layout - 布局模式
     */
    setMenuLayout(layout: MenuLayout) {
      this.menuLayout = layout
      // 水平和双列布局不支持菜单风格，重置为默认值
      if (layout === "horizontal" || layout === "dual") {
        this.menuStyle = "light"
      }
    },

    /**
     * 设置菜单主题风格
     * @param style - 风格
     */
    setMenuStyle(style: MenuStyle) {
      this.menuStyle = style
    },

    /**
     * 设置菜单显示模式
     * @param mode - 模式
     */
    setMenuMode(mode: MenuMode) {
      this.menuMode = mode
    },

    /** 切换菜单折叠状态 */
    toggleMenuCollapsed() {
      this.menuCollapsed = !this.menuCollapsed
    },

    /**
     * 设置菜单折叠状态
     * @param collapsed - 是否折叠
     */
    setMenuCollapsed(collapsed: boolean) {
      this.menuCollapsed = collapsed
    },

    /**
     * 设置菜单展开宽度
     * @param width - 宽度
     */
    setMenuExpandWidth(width: number) {
      this.menuExpandWidth = width
    },

    /**
     * 设置页签显示状态
     * @param show - 是否显示
     */
    setShowProcess(show: boolean) {
      this.showProcess = show
    },

    /** 切换页签显示状态 */
    toggleProcess() {
      this.showProcess = !this.showProcess
    },

    /**
     * 设置水印显示状态
     * @param show - 是否显示
     */
    setShowWatermark(show: boolean) {
      this.showWatermark = show
    },

    /**
     * 设置顶栏是否固定
     * @param fixed - 是否固定
     */
    setFixedHeader(fixed: boolean) {
      this.fixedHeader = fixed
    },

    /**
     * 设置页面过渡动画
     * @param transition - 动画名称
     */
    setTransition(transition: TransitionName) {
      this.transition = transition
    },

    /**
     * 设置系统语言
     * @param lang - 语言代码
     */
    setLanguage(lang: LanguageType) {
      this.language = lang
    },

    /** 重置系统设置 */
    resetSettings() {
      this.$patch({
        menuExpandWidth: 250,
        menuCollapseWidth: 60,
        menuLayout: "vertical",
        menuStyle: "light",
        menuCollapsed: false,
        menuMode: "accordion",
        themeStyle: "light",
        uiTheme: "aurora",
        primaryColor: "#6366f1",
        showProcess: true,
        showWatermark: false,
        fixedHeader: true,
        transition: "fade",
        language: "zh-CN",
        settingsDrawerOpened: false,
        lastMenuLayout: "vertical",
      })
    },

    /** 打开设置面板 */
    openSettingsDrawer() {
      this.settingsDrawerOpened = true
    },

    /** 关闭设置面板 */
    closeSettingsDrawer() {
      this.settingsDrawerOpened = false
    },

    /** 切换设置面板状态 */
    toggleSettingsDrawer() {
      this.settingsDrawerOpened = !this.settingsDrawerOpened
    },
  },

  persist: {
    key: "settings-store",
    omit: ["settingsDrawerOpened"],
  },
})
