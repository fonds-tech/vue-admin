import { computed } from "vue"
import { useUserStore } from "@/stores/user"

/**
 * 权限校验 Hook
 * 提供角色和权限检查功能
 */
export function usePermission() {
  const userStore = useUserStore()

  /**
   * 检查是否有指定角色
   */
  function hasRole(role: string | string[]): boolean {
    const roles = userStore.userInfo.roles
    if (!roles.length) return false

    if (Array.isArray(role)) {
      return role.some((r) => roles.includes(r))
    }
    return roles.includes(role)
  }

  /**
   * 检查是否有指定权限
   */
  function hasPermission(permission: string | string[]): boolean {
    const permissions = userStore.userInfo.permissions
    if (!permissions.length) return false

    // 超级管理员拥有所有权限
    if (permissions.includes("*")) return true

    if (Array.isArray(permission)) {
      return permission.some((p) => permissions.includes(p))
    }
    return permissions.includes(permission)
  }

  /**
   * 是否为管理员
   */
  const isAdmin = computed(() => hasRole("admin"))

  /**
   * 是否已登录
   */
  const isLoggedIn = computed(() => !!userStore.token)

  return {
    hasRole,
    hasPermission,
    isAdmin,
    isLoggedIn,
  }
}
