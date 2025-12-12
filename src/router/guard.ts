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
        const menus = await menuStore.fetchMenus()
        // 注册所有菜单路由
        router.add(menus)
        // 添加 404 兜底路由（必须在动态路由之后）
        if (!router.hasRoute("NotFoundRedirect")) {
          const { notFoundRoute } = await import("./constant")
          router.addRoute(notFoundRoute)
        }
        // 重新导航以匹配新注册的路由
        next({ ...to, replace: true })
        return
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

    // 已初始化，直接放行
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
