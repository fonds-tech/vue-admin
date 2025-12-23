import type { App } from "vue"
import type { MenuRoute } from "@/stores"
import type { RouteRecordRaw } from "vue-router"
import { useMenuStore } from "@/stores"
import { authRoutes, errorRoutes, layoutRoutes } from "./routes"
import { setupAfterEachGuard, setupBeforeEachGuard } from "./guard"
import { createRouter, createWebHistory, createRouterMatcher } from "vue-router"

type AppRouter = ReturnType<typeof createRouter> & {
  add: (data: MenuRoute | MenuRoute[]) => void
  del: (name: string) => void
  find: (path: string) => { isReg: boolean; route?: MenuRoute }
  clear: () => void
}

const pageModules = import.meta.glob("/src/pages/**/index.vue")
const iframePage = () => import("@/pages/iframe/index.vue")

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...authRoutes, ...errorRoutes, ...layoutRoutes],
  scrollBehavior: () => ({ left: 0, top: 0 }),
}) as AppRouter

function isHttpUrl(value?: string) {
  return typeof value === "string" && /^https?:\/\//.test(value)
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`
}

function normalizeChildPath(path: string) {
  return path.startsWith("/") ? path.slice(1) : path
}

function buildDynamicRoute(menu: MenuRoute): RouteRecordRaw | null {
  const meta = { ...menu.meta, dynamic: true }
  const componentPath = meta.component
  const path = normalizeChildPath(menu.path)

  let component: RouteRecordRaw["component"] | undefined

  if (meta.iframe || isHttpUrl(componentPath)) {
    meta.iframe = true
    meta.frameSrc = meta.frameSrc || componentPath
    component = iframePage
  } else if (componentPath) {
    const key = `/src/pages/${componentPath}.vue`
    const loader = pageModules[key]
    if (loader) {
      component = loader
    } else {
      console.error(`未找到页面组件: ${componentPath}`)
      return null
    }
  } else {
    console.error(`菜单路由缺少组件: ${menu.path}`)
    return null
  }

  const baseRoute: RouteRecordRaw = {
    path,
    name: menu.name,
    meta,
    component,
  }

  if (menu.redirect) {
    return { ...baseRoute, redirect: menu.redirect } as RouteRecordRaw
  }

  return baseRoute
}

/** 添加动态路由 */
router.add = (route) => {
  const list = Array.isArray(route) ? route : [route]
  list.forEach((item) => {
    const dynamicRoute = buildDynamicRoute(item)
    if (!dynamicRoute) return

    const normalizedPath = normalizePath(item.path)
    const exists = router.getRoutes().some((record) => normalizePath(record.path) === normalizedPath)
    if (exists || router.hasRoute(dynamicRoute.name!)) return

    router.addRoute("Layout", dynamicRoute)
  })
}

/** 删除动态路由 */
router.del = (name: string) => {
  if (router.hasRoute(name)) {
    router.removeRoute(name)
  }
}

/** 清空动态路由 */
router.clear = () => {
  router.getRoutes().forEach((record) => {
    if (record.name && record.meta?.dynamic) {
      router.removeRoute(record.name)
    }
  })
}

/** 查找路由 */
router.find = (path: string) => {
  const menuStore = useMenuStore()
  const menuRoutes = menuStore.routes.map((item) => ({
    ...item,
    path: normalizePath(item.path),
  }))

  const list = [...router.getRoutes().map((item) => ({ ...item, isReg: true })), ...menuRoutes]
  const matcher = createRouterMatcher(list as any, {})

  let isReg = false
  let route: MenuRoute | undefined

  matcher.getRoutes().find((record) => {
    const reg = new RegExp(record.re)
    if (!reg.test(path)) return false

    const matched = list.find((item) => item.path === record.record.path && item.name !== "Layout")
    if (matched) {
      isReg = !!(matched as any).isReg
      route = matched as MenuRoute
    }
    return true
  })

  return { isReg, route }
}

export function setupRouter(app: App) {
  setupAfterEachGuard(router)
  setupBeforeEachGuard(router)
  app.use(router)
}

export default router
