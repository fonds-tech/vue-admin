/**
 * 用户管理模块类型定义
 */
import type { PageResult } from "@/api/interface"

/** 用户查询参数 */
export interface UserQueryParams {
  page?: number
  pageSize?: number
  username?: string
  status?: number
  deptId?: number
}

/** 用户列表项 */
export interface UserItem {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  status: number
  deptId: number
  deptName: string
  roles: string[]
  createTime: string
  updateTime: string
}

/** 用户表单 */
export interface UserForm {
  id?: number
  username: string
  nickname: string
  password?: string
  email: string
  phone: string
  status: number
  deptId?: number
  roleIds?: number[]
}

/** 用户列表响应 */
export type UserListResult = PageResult<UserItem>
