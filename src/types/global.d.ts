/**
 * 全局类型定义
 */

/** 基础分页参数 */
interface PaginationParams {
  page: number
  pageSize: number
}

/** 基础分页响应 */
interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/** API 响应基础结构 */
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 菜单项类型 */
interface MenuItem {
  id: number
  path: string
  name: string
  component?: string
  redirect?: string
  meta: {
    title: string
    icon?: string
    hidden?: boolean
    keepAlive?: boolean
    affix?: boolean
    permission?: string[]
  }
  children?: MenuItem[]
}

/** 用户信息类型 */
interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  email: string
  phone: string
  roles: string[]
  permissions: string[]
}
