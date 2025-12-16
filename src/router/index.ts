import type { App } from "vue"
import { createRouter, createWebHashHistory } from "vue-router"
import { authRoutes, errorRoutes, layoutRoutes } from "./routes"
import { setupAfterEachGuard, setupBeforeEachGuard } from "./guard"

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...authRoutes, ...errorRoutes, ...layoutRoutes],
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function setupRouter(app: App) {
  setupAfterEachGuard(router)
  setupBeforeEachGuard(router)
  app.use(router)
}

export default router
