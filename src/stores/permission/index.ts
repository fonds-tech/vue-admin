/**
 * 权限状态管理
 * 负责权限校验相关功能
 */
import { defineStore } from "pinia"
import { useUserStore } from "../user"

export const usePermissionStore = defineStore("permission", {
  getters: {
    /**
     * 检查是否有指定角色
     */
    hasRole: () => (role: string | string[]): boolean => {
      const userStore = useUserStore()
      const roles = userStore.userInfo.roles
      if (!roles.length) return false

      if (Array.isArray(role)) {
        return role.some(r => roles.includes(r))
      }
      return roles.includes(role)
    },

    /**
     * 检查是否有指定权限
     */
    hasPermission: () => (permission: string | string[]): boolean => {
      const userStore = useUserStore()
      const permissions = userStore.userInfo.permissions
      if (!permissions.length) return false

      // 超级管理员拥有所有权限
      if (permissions.includes("*")) return true

      if (Array.isArray(permission)) {
        return permission.some(p => permissions.includes(p))
      }
      return permissions.includes(permission)
    },

    /**
     * 是否为管理员
     */
    isAdmin(): boolean {
      return this.hasRole("admin")
    },
  },
})
