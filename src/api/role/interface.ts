/**
 * 角色管理模块类型定义
 */
import type { PageResult } from "@/api/interface"

/** 角色查询参数 */
export interface RoleQueryParams {
  page?: number
  pageSize?: number
  name?: string
  status?: number
}

/** 角色列表项 */
export interface RoleItem {
  id: number
  name: string
  code: string
  description: string
  status: number
  sort: number
  createTime: string
}

/** 角色表单 */
export interface RoleForm {
  id?: number
  name: string
  code: string
  description?: string
  status: number
  sort?: number
  menuIds?: number[]
}

/** 角色列表响应 */
export type RoleListResult = PageResult<RoleItem>
