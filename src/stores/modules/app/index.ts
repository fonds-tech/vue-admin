import type { AppState, DeviceType } from "./types"
import { watch } from "vue"
import { defineStore } from "pinia"
import { useBreakpoints } from "@vueuse/core"

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    token: "",
    refreshToken: "",
    deviceType: "desktop",
  }),

  getters: {
    /** 是否为移动端 */
    isMobile: (state) => state.deviceType === "mobile",
    /** 是否为平板 */
    isTablet: (state) => state.deviceType === "tablet",
    /** 是否为笔记本 */
    isLaptop: (state) => state.deviceType === "laptop",
    /** 是否为桌面端 */
    isDesktop: (state) => state.deviceType === "desktop",
    /** 是否为移动端或平板 */
    isMobileOrTablet: (state) => ["mobile", "tablet"].includes(state.deviceType),
  },

  actions: {
    // ========== 初始化 ==========

    /** 初始化入口（由插件自动调用） */
    initialize() {
      this.initDeviceListener()
    },

    // ========== Token 管理 ==========

    setToken(token: string) {
      this.token = token
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken
    },

    // ========== 设备监听 ==========

    /** 初始化设备类型监听 */
    initDeviceListener() {
      const breakpoints = useBreakpoints<DeviceType>({ mobile: 0, tablet: 768, laptop: 1024, desktop: 1440 })
      const current = breakpoints.active()

      // 监听变化
      watch(
        () => current.value,
        (val) => {
          if (val) {
            this.updateDeviceType(val)
          }
        },
        { immediate: true },
      )
    },

    /** 更新设备类型 */
    updateDeviceType(type: DeviceType) {
      if (type) {
        this.deviceType = type
      }
    },
  },

  persist: {
    key: "app",
    pick: ["token", "refreshToken"], // 设备类型不持久化
  },
})
