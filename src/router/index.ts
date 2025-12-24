import type { App } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import { authRoutes, errorRoutes, layoutRoutes } from "./routes"
import { setupAfterEachGuard, setupBeforeEachGuard } from "./guard"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRoutes, ...errorRoutes, ...layoutRoutes],
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

/**
 * 设置路由
 * @param app Vue 应用实例
 */
export function setupRouter(app: App) {
  setupAfterEachGuard(router)
  setupBeforeEachGuard(router)
  app.use(router)
}

export default router
