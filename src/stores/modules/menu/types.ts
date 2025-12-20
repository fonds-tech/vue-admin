import type { RouteRecordRaw } from "vue-router"

/** 菜单状态 */
export interface MenuState {
  /** 原始菜单列表（服务端返回） */
  list: Menu[]
  /** 过滤后的菜单树（侧边栏渲染用） */
  menus: Menu[]
  /** 路由格式菜单（动态路由注册用） */
  routes: RouteRecordRaw[]
  /** 权限标识集合（按钮权限判断用） */
  permissions: string[]
  /** 是否已初始化 */
  initialized: boolean
  /** 混合模式下当前选中的一级菜单路径 */
  activeFirstLevelPath: string
}

/** 菜单类型：0-目录 1-菜单 2-权限 */
export type MenuType = 0 | 1 | 2

/** 服务端菜单数据（扁平化存储） */
export interface Menu {
  /** 唯一标识 */
  id: number
  /** 父级ID */
  parentId: number
  /** 路由路径 */
  path: string
  /** 路由名称 */
  name: string
  /** 组件路径（目录/权限可为空） */
  component?: string
  /** 重定向路径 */
  redirect?: string
  /** 菜单类型：0-目录 1-菜单 2-权限 */
  type: MenuType
  /** 排序 */
  sort: number
  /** 状态：0-禁用 1-启用 */
  status: 0 | 1
  /** 菜单标题 */
  title: string
  /** 菜单图标 */
  icon?: string
  /** 是否隐藏菜单 */
  hidden?: boolean
  /** 是否缓存页面 */
  keepAlive?: boolean
  /** 权限标识 */
  permission?: string
  /** 路由元信息（可选，用于扩展配置） */
  meta?: MenuMeta
  /** 子菜单 */
  children?: Menu[]
}

/** 路由元信息 */
export interface MenuMeta {
  /** 是否公开路由（白名单） */
  public?: boolean
  /** 菜单图标 */
  icon?: string
  /** 菜单标题 */
  title?: string
  /** 是否隐藏菜单 */
  hidden?: boolean
  /** 是否缓存页面（用于 keep-alive） */
  cache?: boolean
  /** 内嵌 iframe */
  iframe?: boolean
  /** 组件路径 */
  component?: string
}

/** 符合 Vue Router 的菜单路由结构 */
export interface MenuRoute {
  /** 路由路径 */
  path: string
  /** 路由名称 */
  name: string
  /** 重定向路径 */
  redirect?: string
  /** 路由元信息 */
  meta: MenuMeta
  /** 子路由 */
  children?: MenuRoute[]
}
