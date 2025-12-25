import type { RouteMeta as AppRouteMeta } from "@/stores"
import type { RouteComponent, RouteRecordName, RouteRecordRedirectOption } from "vue-router"

export interface DynamicRouteRecord {
  path: string
  name?: RouteRecordName
  meta: AppRouteMeta
  redirect?: RouteRecordRedirectOption
  children?: DynamicRouteRecord[]
  component?: RouteComponent | (() => Promise<RouteComponent>)
}

export interface ViewModule {
  default: RouteComponent
}

export interface ViewModuleMap {
  [key: string]: () => Promise<ViewModule>
}
