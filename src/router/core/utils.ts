import type { RouteRecordRaw } from "vue-router"
import { isUrl } from "@fonds/utils"

// 视图加载器：使用 glob 动态导入所有页面组件
const views = import.meta.glob(["/src/views/**/*.vue", "/src/pages/**/*.vue"])

/**
 * 加载视图组件
 * @param path 组件路径，支持短路径与绝对路径
 */
export function loadView(path: string) {
  const possiblePaths = [
    `/src/views/${path}.vue`,
    `/src/views/${path}/index.vue`,
    `/src/pages/${path}.vue`,
    `/src/pages/${path}/index.vue`,
    `/src/views/${path}`,
    `/src/pages/${path}`,
    path.startsWith("/") ? path : `/${path}`,
  ]

  for (const p of possiblePaths) {
    if (views[p]) return views[p]
  }

  console.warn(`[Router] 视图组件未找到: ${path}`)
  console.warn(`[Router] 可用视图: `, Object.keys(views).slice(0, 10), "...")
  return undefined
}

/** 加载 iframe 组件 */
export function loadIframe() {
  return () => import("@/pages/iframe/index.vue")
}

/**
 * 解析路由组件
 * @returns 找到则返回新的路由对象，找不到返回 null
 */
export function resolveRoute(route: RouteRecordRaw): RouteRecordRaw | null {
  const componentPath = (route.meta?.component as string) || ""

  if (route.component) {
    return { ...route }
  }

  if (isUrl(route.path) || route.meta?.iframe) {
    return { ...route, component: loadIframe() }
  }

  if (componentPath) {
    const comp = loadView(componentPath)
    if (comp) return { ...route, component: comp }
    return null
  }

  return null
}
