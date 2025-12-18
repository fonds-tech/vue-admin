import type { GuardStep } from "../types"
import { resolveRoute } from "./utils"

export const dynamic: GuardStep = ({ menu, router, to, added }) => {
  const target = menu.routes.find(route => route.path === to.path || route.name === to.name)
  if (!target) return

  const key = target.name || target.path
  if (key && added.has(key)) return

  const resolved = resolveRoute(target)
  if (!resolved) {
    return { type: "redirect", to: "/404" }
  }

  router.addRoute("Layout", resolved)
  if (key) {
    added.add(key)
  }

  return { type: "redirect", to: { ...to, replace: true } }
}
