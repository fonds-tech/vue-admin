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
    activeFirstLevelPath: "",
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
     * 设置当前选中的一级菜单路径（混合模式用）
     * @param path 一级菜单路径
     */
    setActiveFirstLevelPath(path: string) {
      this.activeFirstLevelPath = path
    },

    /**
     * 根据当前路由初始化一级菜单选中状态（混合模式用）
     * @param currentPath 当前路由路径
     */
    initActiveFirstLevel(currentPath: string) {
      const matchedMenu = this.menus.find((menu) => {
        if (menu.path === currentPath) return true
        if (currentPath.startsWith(`${menu.path}/`)) return true
        return false
      })
      if (matchedMenu) {
        this.activeFirstLevelPath = matchedMenu.path
      } else if (this.menus.length > 0) {
        this.activeFirstLevelPath = this.menus[0]!.path
      }
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
      this.activeFirstLevelPath = ""
    },
  },
})
