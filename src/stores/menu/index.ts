import type { Menu, MenuState } from "./types"
import { isEmpty } from "@fonds/utils"
import { mockMenus } from "@/mock/menu"
import { defineStore } from "pinia"
import { listToTree, treeToList } from "@/utils/array"
import { menuToRoute, extractPermissions } from "@/utils/menu"

export const useMenuStore = defineStore("menu", {
  state: (): MenuState => ({
    list: [],
    menus: [],
    routes: [],
    permissions: [],
    initialized: false,
  }),
  actions: {
    /**
     * 初始化菜单
     */
    async init() {
      await this.fetchMenus()
    },

    /**
     * 获取菜单数据
     * 实际项目中应调用后端接口
     * @returns 菜单树
     */
    async fetchMenus() {
      this.list = treeToList(mockMenus)

      const menus = this.list.filter((menu) => isEmpty(menu.hidden) && [0, 1].includes(menu.type))
      const routes = this.list.filter((menu) => isEmpty(menu.hidden) && [1].includes(menu.type))

      this.menus = listToTree(menus)

      this.routes = routes.map(menuToRoute)

      this.permissions = extractPermissions(this.list)

      this.initialized = true

      return this.menus
    },

    /**
     * 根据路径查找菜单
     * @param path 路由路径
     */
    findMenu(path: string): Menu | undefined {
      return this.list.find((menu) => menu.path === path)
    },

    /**
     * 检查是否有指定权限
     * @param permission 权限标识
     */
    hasPermission(permission: string): boolean {
      return this.permissions.includes(permission)
    },

    /**
     * 重置菜单状态
     */
    reset() {
      this.list = []
      this.menus = []
      this.routes = []
      this.permissions = []
      this.initialized = false
    },
  },
})
