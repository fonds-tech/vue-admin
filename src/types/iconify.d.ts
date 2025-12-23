/**
 * Iconify Vue 类型声明
 */

// 扩展全局组件类型
declare module "vue" {
  export interface GlobalComponents {
    /** 统一图标组件，支持 Iconify 和 Element Plus 图标 */
    Icon: (typeof import("@/components/Icon/index.vue"))["default"]
  }
}

export {}
