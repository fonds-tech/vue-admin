/**
 * 菜单管理模块类型定义
 */

/** 菜单类型 */
export type MenuType = "directory" | "menu" | "button"

/** 菜单列表项 */
export interface MenuItem {
  id: number
  parentId: number
  name: string
  path: string
  component: string
  redirect?: string
  icon: string
  title: string
  type: MenuType
  permission?: string
  sort: number
  hidden: boolean
  keepAlive: boolean
  status: number
  children?: MenuItem[]
  createTime: string
}

/** 菜单表单 */
export interface MenuForm {
  id?: number
  parentId: number
  name: string
  path: string
  component?: string
  redirect?: string
  icon?: string
  title: string
  type: MenuType
  permission?: string
  sort: number
  hidden: boolean
  keepAlive: boolean
  status: number
}
