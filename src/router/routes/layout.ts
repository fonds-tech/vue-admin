import type { RouteRecordRaw } from "vue-router"

export const layoutRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Layout",
    component: () => import("@/layout/index.vue"),
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/pages/dashboard/index.vue"),
        meta: { title: "首页", icon: "HomeFilled", affix: true },
      },
    ],
  },
]
