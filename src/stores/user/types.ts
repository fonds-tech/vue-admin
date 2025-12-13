/**
 * 用户状态类型定义
 */

export interface UserInfo {
  /** 用户 ID */
  id: number
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname: string
  /** 头像 */
  avatar: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  phone: string
  /** 角色列表 */
  roles: string[]
  /** 权限列表 */
  permissions: string[]
}

export interface UserState {
  /** 用户 Token */
  token: string
  /** 用户信息 */
  userInfo: UserInfo
  /** 最后登录的用户名（用于获取用户信息时确定身份） */
  lastLoginUsername: string
}

/** 默认用户信息 */
export const defaultUserInfo: UserInfo = {
  id: 0,
  username: "",
  nickname: "",
  avatar: "",
  email: "",
  phone: "",
  roles: [],
  permissions: [],
}
