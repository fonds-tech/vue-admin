import type { Menu, MenuRoute } from "@/stores"

/**
 * 将 Menu 转换为菜单路由格式
 * @param menu 菜单数据
 * @returns 菜单路由
 */
export function menuToRoute(menu: Menu): MenuRoute {
  const meta = {
    title: menu.meta?.title ?? menu.title,
    icon: menu.meta?.icon ?? menu.icon,
    hidden: menu.meta?.hidden ?? menu.hidden,
    cache: menu.meta?.cache ?? menu.keepAlive,
    public: menu.meta?.public,
    iframe: menu.meta?.iframe,
    component: menu.meta?.component ?? menu.component,
    dynamic: true,
  }

  const route: MenuRoute = {
    path: menu.path,
    name: menu.name,
    meta,
  }

  // 只有存在时才添加，避免 undefined 导致类型问题
  if (menu.redirect) {
    route.redirect = menu.redirect
  }

  if (menu.children?.length) {
    route.children = menu.children.map(menuToRoute)
  }

  return route
}

/**
 * 提取所有权限标识
 * @param list 菜单列表
 * @returns 权限标识数组
 */
export function extractPermissions(list: Menu[]): string[] {
  return list.filter((menu) => menu.permission).map((menu) => menu.permission!)
}
