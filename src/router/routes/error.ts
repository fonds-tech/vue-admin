import type { RouteRecordRaw } from "vue-router"

export const errorRoutes: RouteRecordRaw[] = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/pages/error/403.vue"),
    meta: { title: "403", ignore: true },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/pages/error/404.vue"),
    meta: { title: "404", ignore: true },
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/pages/error/500.vue"),
    meta: { title: "500", ignore: true },
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () => import("@/pages/error/404.vue"),
    meta: { title: "404", ignore: true },
  },
]
