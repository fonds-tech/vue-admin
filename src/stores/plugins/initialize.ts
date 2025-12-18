import type { PiniaPluginContext } from "pinia"
import { isFunction } from "@fonds/utils"

/**
 * 初始化插件
 * 当 store 被实例化时，检查是否存在 initialize 方法，如果存在则自动调用
 */
export function initializePlugin({ store }: PiniaPluginContext): void {
  // 检查 store 是否有 initialize 方法
  if (isFunction(store.initialize)) {
    // 调用 initialize 方法
    store.initialize()
  }
}
