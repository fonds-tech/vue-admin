/**
 * 全局事件总线
 * 用于组件间通信
 */
import { Mitt } from "@fonds/utils"

/** 事件类型定义 */
interface Events {
  [key: string]: unknown[]
  /** 刷新当前页面 */
  "process:refresh": []
}

/** 事件总线实例 */
export const emitter = new Mitt<Events>()
