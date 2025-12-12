/**
 * 菜单 Store 接口定义
 */
import type { BackendMenu } from "../permission/interface"

/** 菜单状态 */
export interface MenuState {
  /** 是否已初始化 */
  initialized: boolean
  /** 原始菜单树（后端返回） */
  menus: BackendMenu[]
  /** 扁平化菜单（用于快速查找） */
  flatMenus: BackendMenu[]
  /** 已注册的动态路由名称集合 */
  registeredRoutes: Set<string>
}
