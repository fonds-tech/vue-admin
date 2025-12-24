import type { RouteRecordRaw } from "vue-router"

export const errorRoutes: RouteRecordRaw[] = [
  {
    path: "/403",
    name: "403",
    component: () => import("@/pages/error/403.vue"),
    meta: { title: "403", public: true },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/pages/error/404.vue"),
    meta: { title: "404", public: true },
  },
  {
    path: "/500",
    name: "500",
    component: () => import("@/pages/error/500.vue"),
    meta: { title: "500", public: true },
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: () => import("@/pages/error/404.vue"),
    meta: { title: "404" },
  },
]
