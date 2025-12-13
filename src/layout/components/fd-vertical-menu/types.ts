import type { BackendMenu } from "@/stores/permission/interface"

// ==================== 扩展类型 ====================

/** 菜单渲染项（扩展 BackendMenu，包含完整路径） */
export interface MenuRenderItem extends BackendMenu {
  /** 计算后的完整路径 */
  fullPath: string
}

// ==================== 重导出 ====================

/** 重导出 BackendMenu 供外部使用 */
export type { BackendMenu }
