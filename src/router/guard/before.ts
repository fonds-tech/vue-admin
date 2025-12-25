import type { Router } from "vue-router"
import { isEmpty } from "@fonds/utils"
import { useAppStore, useMenuStore } from "@/stores"
import { addDynamicRoute, findRouteByPath } from "../core"

/**
 * 设置路由前置守卫
 * @param router 路由实例
 */
export function setupBeforeEachGuard(router: Router) {
  const app = useAppStore()
  const menu = useMenuStore()

  router.beforeEach(async (to, from, next) => {
    if (to.meta.public) {
      next()
      return
    } else if (app.token) {
      if (menu.initialized === false) {
        await menu.fetchMenus()
      }
    } else {
      next({ path: "/login" })
      return
    }
    const matchedRoute = findRouteByPath(to.path, router, menu.routes)

    if (!matchedRoute) {
      next(app.token ? "/404" : "/login")
      return
    }

    if (isEmpty(matchedRoute.meta.dynamic)) {
      addDynamicRoute(router, matchedRoute)
      next(to.fullPath)
      return
    }

    if (to.path === "/") {
      const home = router.getRoutes().find((e) => e.meta.home)
      if (home) {
        next(home.path)
        return
      }
    }

    next()
  })
}
