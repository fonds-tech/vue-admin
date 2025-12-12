/**
 * 菜单状态管理
 * 统一管理菜单数据、扁平化菜单、路由注册状态
 */
import type { BackendMenu } from "../permission/interface"
import type { MenuState } from "./interface"
import { defineStore } from "pinia"
import { flattenMenus, getVisibleMenus } from "@/router/helper"
import { getMenusByUsername } from "../mock/menu"
import { useUserStore } from "../user"

export const useMenuStore = defineStore("menu", {
  state: (): MenuState => ({
    initialized: false,
    menus: [],
    flatMenus: [],
    registeredRoutes: new Set(),
  }),

  getters: {
    /** 可见菜单（用于侧边栏渲染） */
    visibleMenus: (state) => {
      return getVisibleMenus(state.menus)
    },
  },

  actions: {
    /**
     * 获取菜单数据
     * 根据当前登录用户获取对应的菜单
     */
    async fetchMenus() {
      const userStore = useUserStore()

      // 确保用户信息已获取
      if (!userStore.userInfo.id) {
        await userStore.getUserInfo()
      }

      // 获取菜单数据（实际项目中应调用后端接口）
      const menus = getMenusByUsername(userStore.lastLoginUsername)

      // 存储菜单
      this.menus = menus
      // 扁平化菜单（用于快速查找）
      this.flatMenus = flattenMenus(menus)
      // 标记已初始化
      this.initialized = true

      return menus
    },

    /**
     * 根据路径查找菜单
     * @param path 路由路径
     */
    findMenu(path: string): BackendMenu | undefined {
      return this.flatMenus.find(menu => menu.path === path)
    },

    /**
     * 标记路由已注册
     * @param name 路由名称
     */
    markRouteRegistered(name: string) {
      this.registeredRoutes.add(name)
    },

    /**
     * 检查路由是否已注册
     * @param name 路由名称
     */
    isRouteRegistered(name: string): boolean {
      return this.registeredRoutes.has(name)
    },

    /**
     * 清除所有动态路由记录
     */
    clearRegisteredRoutes() {
      this.registeredRoutes.clear()
    },

    /**
     * 重置菜单状态
     */
    reset() {
      this.initialized = false
      this.menus = []
      this.flatMenus = []
      this.registeredRoutes.clear()
    },
  },
})
