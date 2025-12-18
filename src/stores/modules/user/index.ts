/**
 * 用户状态管理（选项式）
 */
import type { UserState } from "./types"
import { defineStore } from "pinia"
import { defaultUserInfo } from "./types"

/** 模拟 admin 用户信息 */
const mockAdminUser = {
  id: 1,
  username: "admin",
  nickname: "管理员",
  avatar: "",
  email: "admin@example.com",
  phone: "13800138000",
  roles: ["admin"],
  permissions: ["*"],
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: "",
    userInfo: { ...defaultUserInfo },
  }),

  getters: {
    /** 是否已登录 */
    isLoggedIn: state => !!state.token,

    /** 检查是否有指定角色 */
    hasRole: state => (role: string) => state.userInfo.roles.includes(role),

    /** 检查是否有指定权限 */
    hasPermission: state => (permission: string) => {
      // 超级管理员拥有所有权限
      if (state.userInfo.permissions.includes("*")) return true
      return state.userInfo.permissions.includes(permission)
    },
  },

  actions: {
    /** 设置 Token */
    setToken(newToken: string) {
      this.token = newToken
    },

    /**
     * 登录
     * @param username 用户名
     * @param password 密码
     * @returns Token
     */
    async login(username: string, password: string) {
      // 模拟登录验证
      if (username !== "admin" || password !== "123456") {
        throw new Error("用户名或密码错误")
      }

      // 模拟登录成功，生成 Token
      const mockToken = `mock-token-${username}-${Date.now()}`
      this.setToken(mockToken)

      return mockToken
    },

    /**
     * 获取用户信息
     */
    async getUserInfo() {
      this.userInfo = { ...mockAdminUser }
      return this.userInfo
    },

    /** 登出 */
    logout() {
      this.token = ""
      this.userInfo = { ...defaultUserInfo }
    },
  },

  // 持久化配置
  persist: {
    key: "user-store",
    pick: ["token"],
  },
})
