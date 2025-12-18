import type { OSType, DeviceType, BrowserType, DeviceState } from "./types"
import { watch } from "vue"
import { defineStore } from "pinia"
import { useWindowSize, useBreakpoints } from "@vueuse/core"

export const useDeviceStore = defineStore("device", {
  state: (): DeviceState => ({
    os: "unknown",
    type: "desktop",
    width: 0,
    height: 0,
    browser: "unknown",
    isTouch: false,
    pixelRatio: 1,
    orientation: "landscape",
  }),

  getters: {
    /** 是否为移动端 */
    isMobile: (state): boolean => state.type === "mobile",

    /** 是否为平板 */
    isTablet: (state): boolean => state.type === "tablet",

    /** 是否为笔记本 */
    isLaptop: (state): boolean => state.type === "laptop",

    /** 是否为桌面端 */
    isDesktop: (state): boolean => state.type === "desktop",

    /** 是否为移动端或平板 */
    isMobileOrTablet: (state): boolean => ["mobile", "tablet"].includes(state.type),

    /** 是否为竖屏 */
    isPortrait: (state): boolean => state.orientation === "portrait",

    /** 是否为横屏 */
    isLandscape: (state): boolean => state.orientation === "landscape",

    /** 是否为 iOS 设备 */
    isIOS: (state): boolean => state.os === "ios",

    /** 是否为 Android 设备 */
    isAndroid: (state): boolean => state.os === "android",

    /** 是否为 Windows */
    isWindows: (state): boolean => state.os === "windows",

    /** 是否为 macOS */
    isMacOS: (state): boolean => state.os === "macos",

    /** 是否为移动端操作系统 */
    isMobileOS: (state): boolean => ["ios", "android"].includes(state.os),
  },

  actions: {
    /**
     * 初始化入口
     * @description 由插件在 Pinia 实例化后自动调用
     */
    initialize() {
      this.initStaticDetection()
      this.initBreakpointListener()
    },

    /**
     * 初始化断点监听
     * @description 基于 window 尺寸实时更新设备类型和屏幕方向
     */
    initBreakpointListener() {
      const breakpoints = useBreakpoints<DeviceType>({
        mobile: 0,
        tablet: 768,
        laptop: 1024,
        desktop: 1440,
      })
      const current = breakpoints.active()

      // 监听设备类型变化
      watch(
        () => current.value,
        (val) => {
          if (val) {
            this.type = val
          }
        },
        { immediate: true },
      )

      // 监听窗口尺寸变化
      const { width, height } = useWindowSize()
      watch(
        [width, height],
        ([w, h]) => {
          this.width = w
          this.height = h
          this.orientation = w > h ? "landscape" : "portrait"
        },
        { immediate: true },
      )
    },

    /**
     * 初始化静态检测
     * @description 获取系统、浏览器、触摸支持等在会话期间通常不变的信息
     */
    initStaticDetection() {
      this.os = this.getSystemOS()
      this.browser = this.getBrowserType()
      this.isTouch = this.getTouchSupport()
      this.pixelRatio = window.devicePixelRatio || 1
    },

    /**
     * 获取系统操作系统
     * @returns {OSType} 操作系统类型
     */
    getSystemOS(): OSType {
      const ua = navigator.userAgent.toLowerCase()
      if (/iphone|ipad|ipod/.test(ua)) return "ios"
      if (/android/.test(ua)) return "android"
      if (/windows/.test(ua)) return "windows"
      if (/macintosh|mac os x/.test(ua)) return "macos"
      if (/linux/.test(ua)) return "linux"
      return "unknown"
    },

    /**
     * 获取浏览器类型
     * @returns {BrowserType} 浏览器类型
     */
    getBrowserType(): BrowserType {
      const ua = navigator.userAgent.toLowerCase()
      if (/edg/.test(ua)) return "edge"
      if (/opr|opera/.test(ua)) return "opera"
      if (/chrome/.test(ua)) return "chrome"
      if (/safari/.test(ua)) return "safari"
      if (/firefox/.test(ua)) return "firefox"
      return "unknown"
    },

    /**
     * 获取触摸支持情况
     * @returns {boolean} 是否支持触摸
     */
    getTouchSupport(): boolean {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0
    },
  },

  persist: {
    key: "device",
    pick: [], // 不持久化任何数据，每次都重新检测
  },
})
