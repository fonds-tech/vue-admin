/// <reference types="vite/client" />

/**
 * 环境变量类型定义
 */
interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
  /** API 基础地址 */
  readonly VITE_API_BASE_URL: string
  /** 应用环境 */
  readonly VITE_APP_ENV: "development" | "production" | "staging"
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * vite-plugin-svg-icons 虚拟模块声明
 */
declare module "virtual:svg-icons-register" {
  const component: any
  export default component
}

declare module "virtual:svg-icons-names" {
  const iconsNames: string[]
  export default iconsNames
}
