/** 设备类型 */
export type DeviceType = "mobile" | "tablet" | "laptop" | "desktop"

/** 设备方向 */
export type DeviceOrientation = "portrait" | "landscape"

/** 操作系统类型 */
export type OSType = "windows" | "macos" | "linux" | "ios" | "android" | "unknown"

/** 浏览器类型 */
export type BrowserType = "chrome" | "firefox" | "safari" | "edge" | "opera" | "unknown"

export interface DeviceState {
  /** 设备类型（根据屏幕宽度） */
  type: DeviceType
  /** 屏幕宽度 */
  width: number
  /** 屏幕高度 */
  height: number
  /** 设备方向 */
  orientation: DeviceOrientation
  /** 操作系统 */
  os: OSType
  /** 浏览器类型 */
  browser: BrowserType
  /** 是否支持触摸 */
  isTouch: boolean
  /** 设备像素比 */
  pixelRatio: number
}
