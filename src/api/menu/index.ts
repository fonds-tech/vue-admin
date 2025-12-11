/**
 * 菜单管理模块 API
 */
import type { MenuForm, MenuItem } from "./interface"
import { alova } from "@/http"

/** 获取菜单树形列表 */
export function getMenuTree() {
  return alova.Get<MenuItem[]>("/system/menu/tree")
}

/** 获取菜单列表（平铺） */
export function getMenuList() {
  return alova.Get<MenuItem[]>("/system/menu/list")
}

/** 获取菜单详情 */
export function getMenuDetail(id: number) {
  return alova.Get<MenuItem>(`/system/menu/${id}`)
}

/** 新增菜单 */
export function createMenu(data: MenuForm) {
  return alova.Post("/system/menu", data)
}

/** 更新菜单 */
export function updateMenu(id: number, data: MenuForm) {
  return alova.Put(`/system/menu/${id}`, data)
}

/** 删除菜单 */
export function deleteMenu(id: number) {
  return alova.Delete(`/system/menu/${id}`)
}

// 导出类型
export * from "./interface"
