import { createRouter, createWebHashHistory } from "vue-router"
import { authRoutes, errorRoutes, layoutRoutes } from "./routes"

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...authRoutes, ...errorRoutes, ...layoutRoutes],
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export default router
