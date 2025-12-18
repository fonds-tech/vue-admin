/** 设备类型 */
export type DeviceType = "mobile" | "tablet" | "laptop" | "desktop"

export interface AppState {
  token: string
  refreshToken: string
  deviceType: DeviceType
}
