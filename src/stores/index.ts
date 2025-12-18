import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import { createPinia } from "pinia"
import { initializePlugin } from "./plugins/initialize"

const pinia = createPinia()

pinia.use(initializePlugin)
pinia.use(piniaPluginPersistedstate)

export default pinia

export * from "./modules"
