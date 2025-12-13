import UnoCSS from "unocss/vite"

/**
 * 创建 UnoCSS 插件
 * 配置文件自动从项目根目录 uno.config.ts 读取
 */
export function createUnoCSS() {
  return UnoCSS()
}
