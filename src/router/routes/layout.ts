import type { RouteRecordRaw } from "vue-router"

export const layoutRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Layout",
    component: () => import("@/layout/index.vue"),
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        meta: { title: "首页", icon: "HomeFilled", home: true, affix: true },
        component: () => import("@/views/dashboard/index.vue"),
      },
    ],
  },
]
