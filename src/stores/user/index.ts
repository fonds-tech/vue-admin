/**
 * 用户状态管理（选项式）
 */
import type { UserState } from "./interface"
import { defineStore } from "pinia"
import { defaultUserInfo } from "./interface"
import { getMockUserByUsername } from "../mock/menu"

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: "",
    userInfo: { ...defaultUserInfo },
    /** 最后登录的用户名（用于获取用户信息时确定身份） */
    lastLoginUsername: "",
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
      // TODO: 调用真实登录接口
      console.log("Login:", username, password)

      // 模拟登录验证（实际项目中应该调用后端接口）
      // 这里简单模拟：admin/123456 和 user/123456 都可以登录
      if (password !== "123456") {
        throw new Error("用户名或密码错误")
      }

      // 记录登录用户名（用于后续获取用户信息）
      this.lastLoginUsername = username

      // 模拟登录成功，生成 Token
      const mockToken = `mock-token-${username}-${Date.now()}`
      this.setToken(mockToken)

      return mockToken
    },

    /**
     * 获取用户信息
     * 根据登录用户名返回对应的用户信息
     */
    async getUserInfo() {
      // TODO: 调用真实获取用户信息接口
      // 根据登录用户名获取模拟用户信息
      const mockUser = getMockUserByUsername(this.lastLoginUsername)

      this.userInfo = {
        id: mockUser.id,
        username: mockUser.username,
        nickname: mockUser.nickname,
        avatar: mockUser.avatar,
        email: mockUser.email,
        phone: mockUser.phone,
        roles: [...mockUser.roles],
        permissions: [...mockUser.permissions],
      }

      return this.userInfo
    },

    /** 登出 */
    logout() {
      this.token = ""
      this.userInfo = { ...defaultUserInfo }
      this.lastLoginUsername = ""
    },
  },

  // 持久化配置
  persist: {
    key: "user-store",
    pick: ["token", "lastLoginUsername"],
  },
})
