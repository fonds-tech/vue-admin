import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

/**
 * 组件自动注册插件配置
 * - 自动注册 Element Plus 组件
 * - 自动注册 src/components 目录下的组件
 */
export function createComponents() {
  return Components({
    resolvers: [ElementPlusResolver()],
    dts: "src/types/components.d.ts",
    dirs: ["src/components"],
  })
}
