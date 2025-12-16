import type { Router, RouteRecordRaw } from "vue-router"
import { isUrl, isEmpty } from "@fonds/utils"
import { useAppStore, useMenuStore } from "@/stores"

// 视图加载器：使用 glob 动态导入所有页面组件
const views = import.meta.glob(["/src/views/**/*.vue", "/src/pages/**/*.vue"])

/**
 * 加载视图组件
 * @param path 组件路径，支持多种格式：
 *   - 短路径: dashboard/index, article/list/index
 *   - 完整路径: /src/views/dashboard/index.vue
 */
function loadView(path: string) {
  // 构建可能的路径列表
  const possiblePaths = [
    // 短路径格式 (mock 数据常用): dashboard/index -> /src/views/dashboard/index.vue
    `/src/views/${path}.vue`,
    `/src/views/${path}/index.vue`,
    `/src/pages/${path}.vue`,
    `/src/pages/${path}/index.vue`,
    // 已包含 .vue 后缀
    `/src/views/${path}`,
    `/src/pages/${path}`,
    // 完整路径格式
    path.startsWith("/") ? path : `/${path}`,
  ]

  for (const p of possiblePaths) {
    if (views[p]) {
      return views[p]
    }
  }

  console.warn(`[Router] 视图组件未找到: ${path}`)
  console.warn(`[Router] 可用视图: `, Object.keys(views).slice(0, 10), "...")
  return undefined
}

/**
 * 加载 iframe 组件
 */
function loadIframe() {
  return () => import("@/pages/iframe/index.vue")
}

export function setupBeforeEachGuard(router: Router) {
  const app = useAppStore()
  const menu = useMenuStore()

  /**
   * 将菜单路由转换为可注册的路由对象
   */
  const resolveRoute = (route: RouteRecordRaw) => {
    const componentPath = (route.meta?.component as string) || ""
    const { components, children, redirect, ...rest } = route as any

    // 处理 iframe 类型
    if (isUrl(route.path) || route.meta?.iframe) {
      return {
        ...rest,
        component: loadIframe(),
      }
    }

    // 处理普通视图组件
    if (componentPath) {
      const comp = loadView(componentPath)
      if (comp) {
        return {
          ...rest,
          component: comp,
        }
      }
    }

    return route
  }

  /**
   * 添加动态路由
   */
  const addRoute = (route: RouteRecordRaw | RouteRecordRaw[]) => {
    const list = Array.isArray(route) ? route : [route]
    list.forEach((item) => {
      const resolved = resolveRoute(item)
      router.addRoute("Layout", resolved)
    })
  }

  /**
   * 在菜单路由中查找匹配的路由
   */
  const findMenuRoute = (path: string): RouteRecordRaw | undefined => {
    return menu.routes.find((route) => route.path === path)
  }

  router.beforeEach(async (to, from, next) => {
    const existingRoutes = router.getRoutes()

    // 1. 公开路由直接放行（如 /login, /404 等）
    const staticRoute = existingRoutes.find((r) => r.path === to.path)
    if (staticRoute?.meta?.ignore) {
      next()
      return
    }

    // 2. 检查登录状态
    if (isEmpty(app.token)) {
      next("/login")
      return
    }

    // 3. 确保菜单数据已加载（登录后所有页面都需要）
    if (!menu.initialized) {
      await menu.fetchMenus()
    }

    // 4. 已注册路由且有组件则直接放行
    const registeredRoute = router.getRoutes().find((r) => r.path === to.path)
    if (registeredRoute?.components?.default) {
      next()
      return
    }

    // 5. 在菜单路由中查找并动态注册
    const dynamicRoute = findMenuRoute(to.path)
    if (dynamicRoute) {
      addRoute(dynamicRoute)
      next({ ...to, replace: true })
      return
    }

    // 6. 均未找到，跳转 404
    next("/404")
  })
}
