/**
 * 用户状态管理（选项式）
 */
import type { UserState } from "./interface"
import { defineStore } from "pinia"
import { defaultUserInfo } from "./interface"

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

    /** 登录 */
    async login(username: string, password: string) {
      // TODO: 调用登录接口
      console.log("Login:", username, password)

      // 模拟登录成功
      const mockToken = `mock-token-${Date.now()}`
      this.setToken(mockToken)

      return mockToken
    },

    /** 获取用户信息 */
    async getUserInfo() {
      // TODO: 调用获取用户信息接口
      // 模拟用户信息
      this.userInfo = {
        id: 1,
        username: "admin",
        nickname: "管理员",
        avatar: "",
        email: "admin@example.com",
        phone: "13800138000",
        roles: ["admin"],
        permissions: ["*"],
      }

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
