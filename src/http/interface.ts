/**
 * HTTP 请求类型定义
 */

/** API 响应结构 */
export interface ApiResponse<T = unknown> {
  /** 状态码 */
  code: number
  /** 消息 */
  message: string
  /** 数据 */
  data: T
}

/** 业务状态码 */
export enum ResponseCode {
  /** 成功 */
  SUCCESS = 0,
  /** 未授权 */
  UNAUTHORIZED = 401,
  /** 禁止访问 */
  FORBIDDEN = 403,
  /** 未找到 */
  NOT_FOUND = 404,
  /** 服务器错误 */
  SERVER_ERROR = 500,
}

/** 请求配置 */
export interface RequestConfig {
  /** 是否显示加载中 */
  showLoading?: boolean
  /** 是否显示错误提示 */
  showError?: boolean
  /** 是否需要 Token */
  withToken?: boolean
}
