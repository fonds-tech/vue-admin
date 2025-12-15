/** 菜单状态 */
export interface MenuState {
  /** 原始菜单列表（服务端返回） */
  list: Menu[]
  /** 过滤后的菜单树（侧边栏渲染用） */
  menus: Menu[]
  /** 路由格式菜单（动态路由注册用） */
  routes: MenuRoute[]
  /** 权限标识集合（按钮权限判断用） */
  permissions: string[]
  /** 是否已初始化 */
  initialized: boolean
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
  /** 组件路径 */
  component: string
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
  /** 子菜单 */
  children?: Menu[]
}

/** 路由元信息 */
export interface MenuMeta {
  /** 菜单标题 */
  title: string
  /** 菜单图标 */
  icon?: string
  /** 是否隐藏菜单 */
  hidden?: boolean
  /** 是否缓存页面（用于 keep-alive） */
  keepAlive?: boolean
  /** 权限标识 */
  permission?: string
  /** 激活菜单（用于详情页高亮父级菜单） */
  activeMenu?: string
}

/** 符合 Vue Router 的菜单路由结构 */
export interface MenuRoute {
  /** 路由路径 */
  path: string
  /** 路由名称 */
  name: string
  /** 组件路径或组件 */
  component: string | (() => Promise<unknown>)
  /** 重定向路径 */
  redirect?: string
  /** 路由元信息 */
  meta: MenuMeta
  /** 子路由 */
  children?: MenuRoute[]
}
