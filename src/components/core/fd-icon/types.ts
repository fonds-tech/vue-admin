/**
 * FdIcon 组件类型定义
 */

/** 图标旋转角度：0=0°, 1=90°, 2=180°, 3=270° */
export type IconRotate = 0 | 1 | 2 | 3

/** FdIcon 组件属性 */
export interface IconProps {
  /**
   * Iconify 图标名称，如 "mdi:home"、"ep:user"
   */
  icon: string
  /**
   * 图标尺寸
   * - 数字：自动添加 px 单位
   * - 字符串：支持任意 CSS 单位，如 "1.5em"、"24px"
   * @default "1em"
   */
  size?: number | string
  /** 图标颜色，支持任意 CSS 颜色值 */
  color?: string
  /**
   * 水平翻转
   * @default false
   */
  hFlip?: boolean
  /**
   * 垂直翻转
   * @default false
   */
  vFlip?: boolean
  /**
   * 旋转角度
   * - 0: 0°
   * - 1: 90°
   * - 2: 180°
   * - 3: 270°
   * @default 0
   */
  rotate?: IconRotate
}
