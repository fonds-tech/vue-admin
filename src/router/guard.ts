import type { Router, RouteRecordRaw } from "vue-router"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import { useUserStore } from "@/stores/user"
import { usePermissionStore } from "@/stores/permission"

// 配置 NProgress
NProgress.configure({ showSpinner: false })

/** 白名单路由（无需登录即可访问） */
const whiteList = ["/login", "/404", "/403", "/500"]

/**
 * 创建路由守卫
 */
export function setupRouterGuard(router: Router) {
  // 前置守卫
  router.beforeEach(async (to, _from, next) => {
    NProgress.start()
    document.title = `${to.meta.title || ""} - ${import.meta.env.VITE_APP_TITLE}`

    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    const hasToken = userStore.token

    // 已登录
    if (hasToken) {
      if (to.path === "/login") {
        // 已登录访问登录页，重定向到首页
        next({ path: "/" })
        NProgress.done()
        return
      }

      // 检查是否已生成动态路由
      if (permissionStore.isRoutesGenerated) {
        next()
      }
      else {
        try {
          // 获取用户信息（如果尚未获取）
          if (!userStore.userInfo.id) {
            await userStore.getUserInfo()
          }

          // 生成动态路由
          const { roles, permissions } = userStore.userInfo
          const dynamicRoutes = permissionStore.generateRoutes(roles, permissions)

          // 动态添加路由
          dynamicRoutes.forEach((route: RouteRecordRaw) => {
            router.addRoute(route)
          })

          // 触发重新导航，确保新路由生效
          next({ ...to, replace: true })
        }
        catch (error) {
          console.error("[Router Guard] Failed to generate routes:", error)
          // 获取信息失败，清除登录状态
          userStore.logout()
          permissionStore.resetRoutes()
          next(`/login?redirect=${to.path}`)
        }
      }
    }
    else {
      // 未登录
      if (whiteList.includes(to.path)) {
        // 白名单路由直接放行
        next()
      }
      else {
        // 重定向到登录页
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  })

  // 后置守卫
  router.afterEach(() => {
    NProgress.done()
  })

  // 路由错误处理
  router.onError((error) => {
    console.error("[Router Error]:", error)
    NProgress.done()
  })
}
