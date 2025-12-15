import type { Menu } from "@/stores/menu/types"

// ==================== 扩展类型 ====================

/** 菜单渲染项（扩展 Menu，包含完整路径） */
export interface MenuRenderItem extends Menu {
  /** 计算后的完整路径 */
  fullPath: string
}

// ==================== 重导出 ====================

/** 重导出 Menu 供外部使用 */
export type { Menu }
