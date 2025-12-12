/**
 * 静态路由
 * 无需权限即可访问
 * 这些页面放在 pages 目录下，路由硬编码
 */
import type { RouteRecordRaw } from "vue-router"

export const constantRoutes: RouteRecordRaw[] = [
  // 登录页
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/login/index.vue"),
    meta: { title: "登录", hidden: true },
  },
  // 错误页面
  {
    path: "/404",
    name: "NotFound",
    component: () => import("@/pages/error/404.vue"),
    meta: { title: "404", hidden: true },
  },
  {
    path: "/403",
    name: "Forbidden",
    component: () => import("@/pages/error/403.vue"),
    meta: { title: "403", hidden: true },
  },
  {
    path: "/500",
    name: "ServerError",
    component: () => import("@/pages/error/500.vue"),
    meta: { title: "500", hidden: true },
  },
  // 主布局
  {
    path: "/",
    name: "Layout",
    component: () => import("@/layout/index.vue"),
    redirect: "/dashboard",
    children: [
      // 首页
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/pages/dashboard/index.vue"),
        meta: { title: "首页", icon: "HomeFilled", affix: true },
      },
      // 内嵌页面（通用）
      {
        path: "frame/:name?",
        name: "Frame",
        component: () => import("@/pages/iframe/index.vue"),
        meta: { title: "外部页面", hidden: true },
      },
    ],
  },
]

/** 404 兜底路由（需要在动态路由注册后添加） */
export const notFoundRoute: RouteRecordRaw = {
  path: "/:pathMatch(.*)*",
  name: "NotFoundRedirect",
  redirect: "/404",
  meta: { hidden: true },
}
