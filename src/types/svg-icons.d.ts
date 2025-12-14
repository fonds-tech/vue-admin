/**
 * vite-plugin-svg-icons 类型声明
 */
declare module "vite-plugin-svg-icons" {
  import type { Plugin } from "vite"

  interface SvgIconsPluginOptions {
    /** SVG 图标目录路径数组 */
    iconDirs: string[]
    /** symbol id 格式，可使用 [dir] 和 [name] 占位符 */
    symbolId?: string
    /** 注入位置 */
    inject?: "body-first" | "body-last"
    /** 自定义 dom id */
    customDomId?: string
    /** 图标压缩选项 */
    svgoOptions?: boolean | object
  }

  export function createSvgIconsPlugin(options: SvgIconsPluginOptions): Plugin
}
