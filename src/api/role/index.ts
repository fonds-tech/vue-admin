/**
 * 角色管理模块 API
 */
import type { RoleForm, RoleItem, RoleListResult, RoleQueryParams } from "./interface"
import { alova } from "@/http"

/** 获取角色列表 */
export function getRoleList(params: RoleQueryParams) {
  return alova.Get<RoleListResult>("/system/role/list", { params })
}

/** 获取所有角色（下拉选择用） */
export function getAllRoles() {
  return alova.Get<RoleItem[]>("/system/role/all")
}

/** 获取角色详情 */
export function getRoleDetail(id: number) {
  return alova.Get<RoleItem>(`/system/role/${id}`)
}

/** 新增角色 */
export function createRole(data: RoleForm) {
  return alova.Post("/system/role", data)
}

/** 更新角色 */
export function updateRole(id: number, data: RoleForm) {
  return alova.Put(`/system/role/${id}`, data)
}

/** 删除角色 */
export function deleteRole(id: number) {
  return alova.Delete(`/system/role/${id}`)
}

/** 获取角色的菜单权限 */
export function getRoleMenus(id: number) {
  return alova.Get<number[]>(`/system/role/${id}/menus`)
}

/** 更新角色的菜单权限 */
export function updateRoleMenus(id: number, menuIds: number[]) {
  return alova.Put(`/system/role/${id}/menus`, { menuIds })
}

// 导出类型
export * from "./interface"
