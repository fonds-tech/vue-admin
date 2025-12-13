/**
 * 认证模块类型定义
 */

/** 登录参数 */
export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

/** 登录响应 */
export interface LoginResult {
  token: string
  expires: number
}

/** 用户信息 */
export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  email: string
  phone: string
  roles: string[]
  permissions: string[]
}
