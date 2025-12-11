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
