import type { MenuRoute } from "@/stores"
import type { Router, RouteRecordRaw } from "vue-router"

type NamedRoute = RouteRecordRaw | MenuRoute

export function collectRouteNames(routes: NamedRoute[]) {
  return new Set(routes.map((route) => route.name).filter((name): name is string => typeof name === "string" && name.length > 0))
}

export function isSameSet(a: Set<string>, b: Set<string>) {
  if (a.size !== b.size) return false
  for (const value of a) {
    if (!b.has(value)) return false
  }
  return true
}

export function syncRemovedDynamicRoutes(router: Router, activeNames: Set<string>) {
  const dynamicRoutes = router.getRoutes().filter((route) => route.meta?.dynamic)
  for (const route of dynamicRoutes) {
    const name = typeof route.name === "string" ? route.name : ""
    if (name && !activeNames.has(name)) {
      router.removeRoute(name)
    }
  }
}
