/**
 * 路由守卫
 * 实现动态路由懒注册
 */
import type { AppRouter } from "./index"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { useMenuStore } from "@/stores/menu"
import { useUserStore } from "@/stores/user"
import { useProcessStore } from "@/stores/process"

// 配置 NProgress
NProgress.configure({ showSpinner: false })

/** 白名单路由（无需登录即可访问） */
const whiteList = ["/login", "/404", "/403", "/500"]

/**
 * 创建路由守卫
 */
export function setupRouterGuard(router: AppRouter) {
  // 前置守卫
  router.beforeEach(async (to, _from, next) => {
    NProgress.start()

    // 设置页面标题
    document.title = `${to.meta.title || ""} - ${import.meta.env.VITE_APP_TITLE}`

    const userStore = useUserStore()
    const menuStore = useMenuStore()

    // 白名单路由直接放行
    if (whiteList.includes(to.path)) {
      next()
      return
    }

    // 未登录跳转登录页
    if (!userStore.token) {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
      return
    }

    // 已登录访问登录页，重定向到首页
    if (to.path === "/login") {
      next({ path: "/" })
      NProgress.done()
      return
    }

    // 菜单未初始化，先获取菜单
    if (!menuStore.initialized) {
      try {
        await menuStore.fetchMenus()
      }
      catch (error) {
        console.error("[Router Guard] Failed to fetch menus:", error)
        userStore.logout()
        menuStore.reset()
        next(`/login?redirect=${to.path}`)
        NProgress.done()
        return
      }
    }

    // 查找菜单
    const menu = menuStore.findMenu(to.path)

    // 菜单不存在，跳转 404
    if (!menu) {
      // 可能是静态路由（如首页），直接放行
      if (router.hasRoute(to.name as string)) {
        next()
        return
      }
      next("/404")
      NProgress.done()
      return
    }

    // 路由未注册，动态添加
    if (!router.hasRoute(menu.name)) {
      // 查找父级菜单（Layout 级别）
      const parentMenu = menuStore.menus.find((m) => {
        if (m.path === to.path) return true
        return m.children?.some(c => `${m.path}/${c.path}` === to.path)
      })

      if (parentMenu) {
        router.add(parentMenu)
      }
      else {
        router.add(menu)
      }

      // 重新导航，确保新路由生效
      next({ ...to, replace: true })
      return
    }

    next()
  })

  // 后置守卫
  router.afterEach((to) => {
    NProgress.done()

    // 添加进程标签
    // 跳过白名单路由和明确禁用 process 的路由
    if (!whiteList.includes(to.path) && to.meta?.process !== false) {
      const processStore = useProcessStore()
      processStore.add({
        path: to.path,
        fullPath: to.fullPath,
        name: to.name as string,
        title: (to.meta?.title as string) || (to.name as string) || "未命名",
        affix: to.meta?.affix,
      })
    }
  })

  // 路由错误处理
  router.onError((error) => {
    console.error("[Router Error]:", error)
    NProgress.done()

    // 动态导入失败时刷新页面
    if (error.message.includes("Failed to fetch dynamically imported module")) {
      window.location.reload()
    }
  })
}
