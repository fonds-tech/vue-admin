/**
 * 用户管理模块 API
 */
import type { UserForm, UserItem, UserListResult, UserQueryParams } from "./interface"
import { alova } from "@/http"

/** 获取用户列表 */
export function getUserList(params: UserQueryParams) {
  return alova.Get<UserListResult>("/system/user/list", { params })
}

/** 获取用户详情 */
export function getUserDetail(id: number) {
  return alova.Get<UserItem>(`/system/user/${id}`)
}

/** 新增用户 */
export function createUser(data: UserForm) {
  return alova.Post("/system/user", data)
}

/** 更新用户 */
export function updateUser(id: number, data: UserForm) {
  return alova.Put(`/system/user/${id}`, data)
}

/** 删除用户 */
export function deleteUser(id: number) {
  return alova.Delete(`/system/user/${id}`)
}

/** 批量删除用户 */
export function batchDeleteUser(ids: number[]) {
  return alova.Delete("/system/user/batch", { ids })
}

/** 重置用户密码 */
export function resetPassword(id: number, password: string) {
  return alova.Put(`/system/user/${id}/password`, { password })
}

/** 修改用户状态 */
export function updateUserStatus(id: number, status: number) {
  return alova.Put(`/system/user/${id}/status`, { status })
}

// 导出类型
export * from "./interface"
