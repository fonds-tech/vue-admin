/**
 * 认证模块 API
 */
import type { UserInfo, LoginParams, LoginResult } from "./types"
import { alova } from "@/http"

/** 用户登录 */
export function login(data: LoginParams) {
  return alova.Post<LoginResult>("/auth/login", data)
}

/** 用户登出 */
export function logout() {
  return alova.Post("/auth/logout")
}

/** 获取当前用户信息 */
export function getUserInfo() {
  return alova.Get<UserInfo>("/auth/userinfo")
}

/** 刷新 Token */
export function refreshToken() {
  return alova.Post<LoginResult>("/auth/refresh")
}

// 导出类型
export * from "./types"
