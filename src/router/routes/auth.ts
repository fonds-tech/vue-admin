import type { RouteRecordRaw } from "vue-router"

export const authRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/pages/auth/login/index.vue"),
    meta: { title: "登录", ignore: true },
  },
]
