import type { RouteRecordRaw } from "vue-router"
import { systemRoutes } from "./modules/system"

/**
 * 动态路由
 * 根据用户权限动态加载
 */
export const asyncRoutes: RouteRecordRaw[] = [
  // 系统管理模块
  ...systemRoutes,
  // 404 必须放在最后
  { path: "/:pathMatch(.*)*", redirect: "/404", meta: { hidden: true } },
]
