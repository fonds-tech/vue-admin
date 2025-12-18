import type { App } from "vue"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import { createPinia } from "pinia"
import { initializePlugin } from "./plugins/initialize"

const pinia = createPinia()

pinia.use(initializePlugin)
pinia.use(piniaPluginPersistedstate)

export function setupStores(app: App) {
  app.use(pinia)
}

export * from "./modules"
export default pinia
