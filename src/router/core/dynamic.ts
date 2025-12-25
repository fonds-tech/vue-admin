import type { Router, RouteRecordRaw } from "vue-router"
import type { ViewModule, ViewModuleMap, DynamicRouteRecord } from "./types"
import { RouterView } from "vue-router"

const viewModules = import.meta.glob<ViewModule>(["/src/views/*/**/*", "!**/components"])

function resolveRouteComponent(route: DynamicRouteRecord, modules: ViewModuleMap) {
  const componentPath = route.meta.component
  if (!componentPath) return

  const file = modules[`/src/views/${componentPath}.vue`]
  if (file) {
    route.component = () => file().then((mod) => mod.default)
    return
  }

  console.error(`组件${componentPath}不存在`)
}

function toRouterRecord(route: DynamicRouteRecord): RouteRecordRaw {
  if (route.redirect && !route.component) {
    return {
      path: route.path,
      name: route.name,
      meta: route.meta,
      redirect: route.redirect,
    }
  }

  if (route.redirect && route.component) {
    console.warn(`路由${route.path}同时配置了redirect与component，请确认配置是否符合预期`)
  }

  const record: RouteRecordRaw = {
    path: route.path,
    name: route.name,
    meta: route.meta,
    component: route.component ?? RouterView,
  }

  if (route.children && route.children.length > 0) {
    return {
      ...record,
      children: route.children.map(toRouterRecord),
    }
  }

  return record
}

export function addDynamicRoute(router: Router, route: DynamicRouteRecord, modules: ViewModuleMap = viewModules) {
  resolveRouteComponent(route, modules)
  route.meta.dynamic = true
  router.addRoute("Layout", toRouterRecord(route))
}
