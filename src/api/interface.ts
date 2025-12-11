/**
 * API 通用类型定义
 */

/**
 * 分页响应
 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 通用响应
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/**
 * 分页查询参数
 */
export interface PageParams {
  page?: number
  pageSize?: number
}
