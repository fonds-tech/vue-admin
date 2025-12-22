/**
 * FdIcon 图标组件
 *
 * 支持 Iconify 图标和 Vue 组件图标
 *
 * @example
 * ```vue
 * <!-- Iconify 图标 -->
 * <FdIcon icon="mdi:home" size="24px" color="#333" />
 *
 * <!-- Element Plus 图标 -->
 * <FdIcon :icon="ElIconUser" size="20" />
 *
 * <!-- 翻转和旋转 -->
 * <FdIcon icon="mdi:arrow-right" :rotate="1" h-flip />
 * ```
 */

import FdIcon from "./fd-icon.vue"

export { FdIcon }
export * from "./types"
export default FdIcon
