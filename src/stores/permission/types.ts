/**
 * 权限 Store 接口定义
 */
import type { RouteRecordRaw } from "vue-router"

/** 权限状态 */
export interface PermissionState {
  /** 是否已生成路由 */
  isRoutesGenerated: boolean
  /** 动态路由列表 */
  dynamicRoutes: RouteRecordRaw[]
  /** 菜单列表（用于渲染侧边栏） */
  menuList: RouteRecordRaw[]
}

/** 后端返回的菜单数据 */
export interface BackendMenu {
  id: number
  parentId: number
  path: string
  name: string
  component: string
  redirect?: string
  meta: {
    title: string
    icon?: string
    hidden?: boolean
    keepAlive?: boolean
    permissions?: string[]
    roles?: string[]
    frameSrc?: string
    link?: string
  }
  children?: BackendMenu[]
}
