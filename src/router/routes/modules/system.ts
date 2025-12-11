import type { RouteRecordRaw } from "vue-router"

/**
 * 系统管理模块路由
 */
export const systemRoutes: RouteRecordRaw[] = [
  {
    path: "/system",
    name: "System",
    component: () => import("@/layout/index.vue"),
    redirect: "/system/user",
    meta: { title: "系统管理", icon: "Setting" },
    children: [
      {
        path: "user",
        name: "User",
        component: () => import("@/views/system/user/index.vue"),
        meta: { title: "用户管理", icon: "User" },
      },
      {
        path: "role",
        name: "Role",
        component: () => import("@/views/system/role/index.vue"),
        meta: { title: "角色管理", icon: "UserFilled" },
      },
      {
        path: "menu",
        name: "Menu",
        component: () => import("@/views/system/menu/index.vue"),
        meta: { title: "菜单管理", icon: "Menu" },
      },
    ],
  },
]
