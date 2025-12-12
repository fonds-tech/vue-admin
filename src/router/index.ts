/**
 * Vue Router 配置入口
 * 扩展 router 实例，支持动态路由懒注册
 */
import type { Router } from "vue-router"
import type { BackendMenu } from "@/stores/permission/interface"
import { constantRoutes } from "./constant"
import { setupRouterGuard } from "./guard"
import { transformMenuToRoute } from "./helper"
import { createRouter, createWebHistory } from "vue-router"

/** 扩展的 Router 类型 */
export interface AppRouter extends Router {
  /** 添加动态路由 */
  add: (menu: BackendMenu | BackendMenu[]) => void
  /** 删除指定路由 */
  del: (name: string) => void
  /** 清除所有动态路由 */
  clear: () => void
}

/**
 * 创建路由实例
 */
const baseRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

// 扩展 router 实例
const router = baseRouter as AppRouter

/**
 * 添加动态路由
 * @param menu 菜单数据（单个或数组）
 */
router.add = (menu: BackendMenu | BackendMenu[]) => {
  const list = Array.isArray(menu) ? menu : [menu]

  list.forEach((item) => {
    // 布局组件本身不注册，它的子路由才需要注册
    if (item.component === "Layout") {
      // 递归注册子路由
      if (item.children?.length) {
        item.children.forEach((child) => {
          registerRoute(child, item.path)
        })
      }
      return
    }

    // 注册普通路由
    registerRoute(item, "")
  })
}

/**
 * 注册单个路由
 * @param menu 菜单项
 * @param parentPath 父级路径
 */
function registerRoute(menu: BackendMenu, parentPath: string) {
  // 已注册则跳过
  if (router.hasRoute(menu.name)) {
    return
  }

  // 转换为路由配置
  const route = transformMenuToRoute(menu, parentPath)

  if (route) {
    // 添加到 Layout 下
    router.addRoute("Layout", route)
    console.log(`[Router] Registered: ${menu.name} -> ${menu.path}`)
  }

  // 递归处理子路由
  if (menu.children?.length) {
    const fullPath = parentPath ? `${parentPath}/${menu.path}` : menu.path
    menu.children.forEach((child) => {
      registerRoute(child, fullPath)
    })
  }
}

/**
 * 删除指定路由
 * @param name 路由名称
 */
router.del = (name: string) => {
  if (router.hasRoute(name)) {
    router.removeRoute(name)
  }
}

/**
 * 清除所有动态路由
 */
router.clear = () => {
  const routes = router.getRoutes()
  routes.forEach((route) => {
    if (route.meta?.dynamic && route.name) {
      router.removeRoute(route.name)
    }
  })
}

// 设置路由守卫
setupRouterGuard(router)

// 导出路由配置供其他模块使用
export { constantRoutes }

export default router
