import type { DynamicRouteRecord } from "./types"
import type { MenuRoute, RouteMeta as AppRouteMeta } from "@/stores"
import type { Router, RouteRecordRaw, RouteRecordNormalized } from "vue-router"
import { RouterView, createRouterMatcher } from "vue-router"

type MatchSource = RouteRecordNormalized | MenuRoute | RouteRecordRaw

function toDynamicRouteRecord(route: MatchSource): DynamicRouteRecord {
  const children = route.children?.map((child) => toDynamicRouteRecord(child))
  const meta: AppRouteMeta = route.meta ?? {}
  const record: DynamicRouteRecord = {
    path: route.path,
    name: route.name,
    meta,
  }

  if ("redirect" in route && route.redirect) {
    record.redirect = route.redirect
  }

  if (children && children.length > 0) {
    record.children = children
  }

  return record
}

function toMatchRecord(route: DynamicRouteRecord): RouteRecordRaw {
  if (route.redirect) {
    return {
      path: route.path,
      name: route.name,
      meta: route.meta,
      redirect: route.redirect,
    }
  }

  const record: RouteRecordRaw = {
    path: route.path,
    name: route.name,
    meta: route.meta,
    component: RouterView,
  }

  if (route.children && route.children.length > 0) {
    return {
      ...record,
      children: route.children.map(toMatchRecord),
    }
  }

  return record
}

export function findRouteByPath(path: string, router: Router, menuRoutes: MenuRoute[]): DynamicRouteRecord | undefined {
  const list = [...router.getRoutes().map(toDynamicRouteRecord), ...menuRoutes.map(toDynamicRouteRecord)]
  const matcher = createRouterMatcher(list.map(toMatchRecord), {})
  let matched: DynamicRouteRecord | undefined

  matcher.getRoutes().find((item) => {
    const re = new RegExp(item.re)
    if (re.test(path)) {
      matched = path === "/" ? list.find((route) => route.meta.home) : list.find((route) => route.path === item.record.path)
      return true
    }
    return false
  })

  return matched
}
