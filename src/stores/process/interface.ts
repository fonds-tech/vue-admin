/**
 * Process Store 类型定义
 * 进程标签页状态管理
 */

/** 进程项类型 */
export interface ProcessItem {
  /** 路由路径 */
  path: string
  /** 完整路径（含参数） */
  fullPath: string
  /** 路由名称 */
  name: string
  /** 显示标题 */
  title: string
  /** 是否激活 */
  active: boolean
  /** 是否固定（不可关闭） */
  affix?: boolean
}

/** Store 状态类型 */
export interface ProcessState {
  /** 进程列表 */
  list: ProcessItem[]
}
