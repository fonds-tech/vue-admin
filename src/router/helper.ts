/**
 * 路由工具函数
 * 提供菜单转换、路径匹配等功能
 */
import type { RouteRecordRaw } from "vue-router"
import type { BackendMenu } from "@/stores/permission/interface"

// 视图模块映射（用于动态导入）
const viewModules = import.meta.glob("/src/views/**/*.vue")

/**
 * 将后端菜单转换为路由配置
 * @param menu 后端菜单数据
 * @param parentPath 父级路径
 */
export function transformMenuToRoute(menu: BackendMenu, parentPath = ""): RouteRecordRaw | null {
  // 布局组件跳过（布局已在 constantRoutes 中）
  if (menu.component === "Layout") {
    return null
  }

  // 计算完整路径
  const fullPath = parentPath ? `${parentPath}/${menu.path}` : menu.path

  // 获取组件
  const component = getComponent(menu.component, menu.meta)

  if (!component) {
    console.warn(`[Router] Component not found: ${menu.component}`)
    return null
  }

  const route: RouteRecordRaw = {
    path: menu.path,
    name: menu.name,
    component,
    meta: {
      ...menu.meta,
      dynamic: true, // 标记为动态路由
    },
  }

  // 添加重定向
  if (menu.redirect) {
    (route as any).redirect = menu.redirect
  }

  return route
}

/**
 * 根据组件路径获取组件
 * @param componentPath 组件路径
 * @param meta 路由元信息
 */
function getComponent(componentPath: string, meta?: BackendMenu["meta"]): (() => Promise<unknown>) | null {
  // 空组件路径
  if (!componentPath) {
    return null
  }

  // iframe 组件
  if (meta?.frameSrc) {
    return () => import("@/pages/iframe/index.vue")
  }

  // 外链（无需组件）
  if (meta?.link) {
    return null
  }

  // 尝试从 views 目录加载
  const viewPath = `/src/views/${componentPath}.vue`
  if (viewModules[viewPath]) {
    return viewModules[viewPath] as () => Promise<unknown>
  }

  return null
}

/**
 * 扁平化菜单树
 * @param menus 菜单树
 * @param parentPath 父级路径
 */
export function flattenMenus(menus: BackendMenu[], parentPath = ""): BackendMenu[] {
  const result: BackendMenu[] = []

  menus.forEach((menu) => {
    // 计算完整路径
    const fullPath = menu.path.startsWith("/")
      ? menu.path
      : parentPath
        ? `${parentPath}/${menu.path}`
        : `/${menu.path}`

    // 添加当前菜单（带完整路径）
    result.push({
      ...menu,
      path: fullPath,
    })

    // 递归处理子菜单
    if (menu.children?.length) {
      result.push(...flattenMenus(menu.children, fullPath))
    }
  })

  return result
}

/**
 * 根据路径查找菜单
 * @param flatMenus 扁平化菜单列表
 * @param path 路径
 */
export function findMenuByPath(flatMenus: BackendMenu[], path: string): BackendMenu | undefined {
  // 精确匹配
  return flatMenus.find(menu => menu.path === path)
}

/**
 * 获取菜单树（用于侧边栏渲染）
 * 过滤隐藏菜单
 */
export function getVisibleMenus(menus: BackendMenu[]): BackendMenu[] {
  return menus
    .filter(menu => !menu.meta.hidden)
    .map((menu) => {
      if (menu.children?.length) {
        return {
          ...menu,
          children: getVisibleMenus(menu.children),
        }
      }
      return menu
    })
}
