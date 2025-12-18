import type { Router } from "vue-router"
import type { GuardCtx, GuardStep, GuardResult } from "../core"
import { useAppStore, useMenuStore } from "@/stores"
import { auth, menus, dynamic, fallback, whitelist, registered } from "../core"

const steps: GuardStep[] = [whitelist, auth, menus, registered, dynamic, fallback]

export function setupBeforeEachGuard(router: Router) {
  const base: Omit<GuardCtx, "to" | "from"> = {
    router,
    app: useAppStore(),
    menu: useMenuStore(),
    added: new Set<string>(),
  }

  router.beforeEach(async (to, from, next) => {
    const ctx: GuardCtx = { ...base, to, from }

    for (const step of steps) {
      const res = (await step(ctx)) as GuardResult | void
      if (!res) continue

      if (res.type === "next") return next()
      if (res.type === "redirect") return next(res.to)
      if (res.type === "abort") return next(false)
    }

    next()
  })
}
