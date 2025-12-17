import type { useAppStore, useMenuStore } from "@/stores"
import type { Router, RouteLocationRaw, RouteLocationNormalized } from "vue-router"

export type AppStore = ReturnType<typeof useAppStore>
export type MenuStore = ReturnType<typeof useMenuStore>

export interface GuardCtx {
  router: Router
  to: RouteLocationNormalized
  from: RouteLocationNormalized
  app: AppStore
  menu: MenuStore
  added: Set<string>
}

export type GuardResult
  = | { type: "next" }
    | { type: "redirect", to: RouteLocationRaw }
    | { type: "abort" }

export type GuardStep = (ctx: GuardCtx) => Promise<GuardResult | void> | GuardResult | void
