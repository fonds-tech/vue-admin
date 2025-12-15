import type { Menu, MenuRoute } from "@/stores/menu/types"

/**
 * 将 Menu 转换为 MenuRoute 格式
 * @param menu 菜单数据
 * @returns 路由格式菜单
 */
export function menuToRoute(menu: Menu): MenuRoute {
  return {
    path: menu.path,
    name: menu.name,
    component: menu.component,
    redirect: menu.redirect,
    meta: {
      title: menu.title,
      icon: menu.icon,
      hidden: menu.hidden,
      keepAlive: menu.keepAlive,
      permission: menu.permission,
    },
    children: menu.children?.map(menuToRoute),
  }
}

/**
 * 提取所有权限标识
 * @param list 菜单列表
 * @returns 权限标识数组
 */
export function extractPermissions(list: Menu[]): string[] {
  return list.filter((menu) => menu.permission).map((menu) => menu.permission!)
}
