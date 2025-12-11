/**
 * Vue Router 配置入口
 */
import { setupRouterGuard } from "./guard"
import { asyncRoutes, constantRoutes } from "./routes"
import { createRouter, createWebHistory } from "vue-router"

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 设置路由守卫
setupRouterGuard(router)

// 导出路由配置供其他模块使用
export { asyncRoutes, constantRoutes }

export default router
