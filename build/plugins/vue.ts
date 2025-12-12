import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"

/**
 * Vue 插件配置
 * 包含 Vue SFC 和 JSX/TSX 支持
 */
export function createVuePlugin() {
  return [vue(), vueJsx()]
}
