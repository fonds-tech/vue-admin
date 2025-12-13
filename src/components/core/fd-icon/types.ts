/**
 * Icon 组件类型定义
 */

import type { Component } from "vue"

/** 图标旋转角度 */
export type IconRotate = 0 | 1 | 2 | 3

/** Icon 组件属性 */
export interface IconProps {
  /** 图标名称，Iconify 格式如 "mdi:home" 或 Element Plus 图标组件 */
  icon: string | Component
  /** 图标尺寸，可以是数字（px）或字符串（如 "1.5em"） */
  size?: number | string
  /** 图标颜色 */
  color?: string
  /** 水平翻转 */
  hFlip?: boolean
  /** 垂直翻转 */
  vFlip?: boolean
  /** 旋转角度：0=0deg, 1=90deg, 2=180deg, 3=270deg */
  rotate?: IconRotate
}
