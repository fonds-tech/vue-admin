import type { Router } from "vue-router"
import type { GuardCtx, GuardStep, GuardResult } from "../core"
import { useAppStore, useMenuStore } from "@/stores"
import {
  auth,
  menus,
  dynamic,
  fallback,
  isSameSet,
  whitelist,
  registered,
  collectRouteNames,
  syncRemovedDynamicRoutes,
} from "../core"

const steps: GuardStep[] = [whitelist, auth, menus, registered, dynamic, fallback]

export function setupBeforeEachGuard(router: Router) {
  const menuStore = useMenuStore()
  const added = new Set<string>()
  let lastRouteNames = new Set<string>()

  const base: Omit<GuardCtx, "to" | "from"> = {
    router,
    app: useAppStore(),
    menu: menuStore,
    added,
  }

  router.beforeEach(async (to, from, next) => {
    const ctx: GuardCtx = { ...base, to, from }

    for (const step of steps) {
      const res = (await step(ctx)) as GuardResult | void

      if (step === menus) {
        const currentNames = collectRouteNames(menuStore.routes)
        if (!isSameSet(currentNames, lastRouteNames)) {
          syncRemovedDynamicRoutes(router, currentNames)
          added.clear()
          lastRouteNames = currentNames
        }
      }

      if (!res) continue

      if (res.type === "next") return next()
      if (res.type === "redirect") return next(res.to)
      if (res.type === "abort") return next(false)
    }

    next()
  })
}
