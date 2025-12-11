import AutoImport from "unplugin-auto-import/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"

/**
 * 自动导入插件配置
 * - 自动导入 Vue、Vue Router、Pinia、VueUse、Vue I18n 等 API
 * - 自动导入 Element Plus 组件
 * - 自动导入 composables 和 stores 目录下的函数
 */
export function createAutoImport() {
  return AutoImport({
    imports: ["vue", "vue-router", "pinia", "@vueuse/core", "vue-i18n"],
    resolvers: [ElementPlusResolver()],
    dts: "src/types/auto-imports.d.ts",
    dirs: ["src/composables", "src/stores/modules"],
    vueTemplate: true,
  })
}
