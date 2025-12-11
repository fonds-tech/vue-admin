/**
 * 权限状态管理
 * 负责动态路由的生成和管理
 */
import type { RouteRecordRaw } from "vue-router"
import type { BackendMenu, PermissionState } from "./interface"
import { asyncRoutes } from "@/router/routes"
import { defineStore } from "pinia"

// 视图组件映射（用于动态导入）
const viewModules = import.meta.glob("@/views/**/*.vue")
const pageModules = import.meta.glob("@/pages/**/*.vue")

/**
 * 根据组件路径获取组件
 */
function getComponent(component: string): (() => Promise<unknown>) | undefined {
  // 布局组件
  if (component === "Layout") {
    return () => import("@/layout/index.vue")
  }
  // iframe 组件
  if (component === "IFrame") {
    return () => import("@/pages/iframe/index.vue")
  }
  // 尝试从 views 目录加载
  const viewPath = `/src/views/${component}.vue`
  if (viewModules[viewPath]) {
    return viewModules[viewPath] as () => Promise<unknown>
  }
  // 尝试从 pages 目录加载
  const pagePath = `/src/pages/${component}.vue`
  if (pageModules[pagePath]) {
    return pageModules[pagePath] as () => Promise<unknown>
  }
  console.warn(`[Permission] Component not found: ${component}`)
  return undefined
}

/**
 * 将后端菜单数据转换为路由配置
 */
function transformMenuToRoutes(menus: BackendMenu[]): RouteRecordRaw[] {
  return menus.map((menu) => {
    const route = {
      path: menu.path,
      name: menu.name,
      component: getComponent(menu.component),
      meta: menu.meta,
      children: menu.children ? transformMenuToRoutes(menu.children) : undefined,
    } as RouteRecordRaw
    // 只有存在 redirect 时才添加
    if (menu.redirect) {
      ;(route as RouteRecordRaw & { redirect?: string }).redirect = menu.redirect
    }
    return route
  })
}

/**
 * 过滤路由（根据用户权限）
 */
function filterRoutesByPermission(routes: RouteRecordRaw[], roles: string[], permissions: string[]): RouteRecordRaw[] {
  return routes.filter((route) => {
    // 检查角色权限
    if (route.meta?.roles?.length) {
      const hasRole = route.meta.roles.some(role => roles.includes(role))
      if (!hasRole) return false
    }
    // 检查权限码
    if (route.meta?.permissions?.length) {
      // 超级管理员拥有所有权限
      if (permissions.includes("*")) return true
      const hasPermission = route.meta.permissions.some(p => permissions.includes(p))
      if (!hasPermission) return false
    }
    // 递归过滤子路由
    if (route.children?.length) {
      route.children = filterRoutesByPermission(route.children, roles, permissions)
    }
    return true
  })
}

/**
 * 获取菜单列表（过滤隐藏项）
 */
function getMenuList(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes
    .filter(route => !route.meta?.hidden)
    .map((route) => {
      const item = { ...route } as RouteRecordRaw
      if (route.children) {
        ;(item as RouteRecordRaw & { children?: RouteRecordRaw[] }).children = getMenuList(route.children)
      }
      return item
    })
}

export const usePermissionStore = defineStore("permission", {
  state: (): PermissionState => ({
    isRoutesGenerated: false,
    dynamicRoutes: [],
    menuList: [],
  }),

  actions: {
    /**
     * 生成动态路由
     * @param roles 用户角色列表
     * @param permissions 用户权限列表
     * @param backendMenus 后端返回的菜单数据（可选，如果为空则使用本地 asyncRoutes）
     */
    generateRoutes(roles: string[], permissions: string[], backendMenus?: BackendMenu[]) {
      let accessedRoutes: RouteRecordRaw[]

      if (backendMenus?.length) {
        // 使用后端返回的菜单数据
        accessedRoutes = transformMenuToRoutes(backendMenus)
      }
      else {
        // 使用本地配置的 asyncRoutes，根据权限过滤
        accessedRoutes = filterRoutesByPermission([...asyncRoutes], roles, permissions)
      }

      this.dynamicRoutes = accessedRoutes
      this.menuList = getMenuList(accessedRoutes)
      this.isRoutesGenerated = true

      return accessedRoutes
    },

    /**
     * 重置路由状态
     */
    resetRoutes() {
      this.isRoutesGenerated = false
      this.dynamicRoutes = []
      this.menuList = []
    },
  },
})
