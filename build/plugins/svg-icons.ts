import process from "node:process"
import { resolve } from "node:path"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"

/**
 * 创建 SVG Icons 插件
 * 将 src/assets/svg 目录下的 SVG 文件自动生成 symbol sprite
 */
export function createSvgIcons() {
  return createSvgIconsPlugin({
    // SVG 图标目录
    iconDirs: [resolve(process.cwd(), "src/assets/svg")],
    // symbol id 格式
    symbolId: "icon-[dir]-[name]",
    // 注入位置
    inject: "body-last",
    // 自定义 dom id
    customDomId: "__svg__icons__dom__",
  })
}
