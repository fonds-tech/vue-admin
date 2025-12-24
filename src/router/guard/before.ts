import type { Router } from "vue-router"
import { isEmpty } from "@fonds/utils"
import { createRouterMatcher } from "vue-router"
import { useAppStore, useMenuStore } from "@/stores"

const files = import.meta.glob(["/src/views/*/**/*", "!**/components"])

/**
 * 设置路由前置守卫
 * @param router 路由实例
 */
export function setupBeforeEachGuard(router: Router) {
  const app = useAppStore()
  const menu = useMenuStore()

  const addRoute = (route: any) => {
    if (route.meta.component) {
      const file = files[`/src/views/${route.meta.component}.vue`]
      if (file) {
        route.component = file
      } else {
        console.error(`组件${route.meta.component}不存在`)
      }
    }
    route.meta.dynamic = true
    router.addRoute("Layout", route)
  }

  const findRoute = (path: string) => {
    let route: any
    const list = [...router.getRoutes(), ...menu.routes]
    const matcher = createRouterMatcher(list as any, {})
    matcher.getRoutes().find((item) => {
      const re = new RegExp(item.re)
      if (re.test(path)) {
        route = path === "/" ? list.find((e) => e.meta.home) : list.find((e) => e.path === item.record.path)
        return true
      }
      return false
    })
    return route
  }

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
    const find = findRoute(to.path)

    if (isEmpty(find)) {
      next(app.token ? "/404" : "/login")
      return
    }

    if (isEmpty(find.meta.dynamic)) {
      addRoute(find)
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
