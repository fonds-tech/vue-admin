/**
 * Pinia 状态管理入口
 */
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import { createPinia } from "pinia"

const pinia = createPinia()

// 注册持久化插件
pinia.use(piniaPluginPersistedstate)

export default pinia

export { useAppStore } from "./app"
export { useMenuStore } from "./menu"
export { usePermissionStore } from "./permission"
export { useProcessStore } from "./process"
export { useSettingsStore } from "./settings"
// 导出所有 Store
export { useUserStore } from "./user"
