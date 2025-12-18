import type { Menu } from "@/stores"
import { Icon } from "@/components/core/fd-icon"
import { useMenuStore } from "@/stores"
import { useSettingsStore } from "@/stores"
import { useRoute, useRouter } from "vue-router"
import { computed, defineComponent } from "vue"
import { ElMenu, ElSubMenu, ElMenuItem } from "element-plus"
import "./index.scss"

/** 菜单配置常量 */
const MENU_CONFIG = {
  /** 菜单项图标大小 */
  ICON_SIZE: 18,
  /** 子菜单图标大小 */
  SUB_MENU_ICON_SIZE: 16,
} as const

// ==================== 组件定义 ====================

export default defineComponent({
  name: "fd-horizontal-menu",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const menuStore = useMenuStore()
    const settingsStore = useSettingsStore()

    // ==================== 计算属性 ====================

    /** 可见菜单列表 */
    const menuList = computed<Menu[]>(() => menuStore.menus)

    /** 菜单是否使用手风琴模式 */
    const isAccordionMode = computed<boolean>(() => settingsStore.menuMode === "accordion")

    /** 当前激活的菜单路径 */
    const activeMenuPath = computed<string>(() => {
      if (route.meta.activeMenu) {
        return route.meta.activeMenu as string
      }
      return route.path
    })

    // ==================== 工具函数 ====================

    /** 判断是否为外链 */
    function isExternalLink(path: string): boolean {
      return /^https?:\/\//.test(path)
    }

    /** 计算完整路径 */
    function getFullPath(path: string, basePath: string): string {
      if (isExternalLink(path)) return path
      if (path.startsWith("/")) return path
      return basePath ? `${basePath}/${path}`.replace(/\/+/g, "/") : `/${path}`
    }

    /** 判断菜单是否只有单个可提升的子项 */
    function isSinglePromotableChild(menu: Menu): boolean {
      if (!menu.children || menu.children.length !== 1) return false
      return !menu.children[0]?.children?.length
    }

    /**
     * 递归过滤菜单项，移除隐藏的菜单
     * 如果一个父菜单的所有子菜单都被隐藏，则父菜单也会被隐藏
     */
    function filterMenuItems(items: Menu[]): Menu[] {
      return items
        .filter((item) => {
          if (item.meta?.hidden) return false
          if (item.children && item.children.length > 0) {
            const filteredChildren = filterMenuItems(item.children)
            return filteredChildren.length > 0
          }
          return true
        })
        .map((item) => ({
          ...item,
          children: item.children ? filterMenuItems(item.children) : undefined,
        }))
    }

    /** 过滤后的菜单项列表 */
    const filteredMenus = computed(() => filterMenuItems(menuList.value))

    // ==================== 事件处理 ====================

    /** 菜单选择处理 */
    function handleMenuSelect(path: string): void {
      if (isExternalLink(path)) {
        window.open(path, "_blank", "noopener,noreferrer")
        return
      }
      router.push(path)
    }

    // ==================== 渲染函数 ====================

    /** 渲染菜单图标 */
    function renderIcon(icon?: string, size: number = MENU_CONFIG.SUB_MENU_ICON_SIZE) {
      if (!icon) return null
      return <Icon icon={icon} size={size} class="fd-horizontal-menu__icon" />
    }

    /** 渲染菜单标题 */
    function renderTitle(title?: string) {
      return <span class="fd-horizontal-menu__title">{title || "未命名菜单"}</span>
    }

    /** 渲染叶子菜单项（无子菜单） */
    function renderLeafMenuItem(menu: Menu, fullPath: string) {
      return (
        <ElMenuItem key={menu.path} index={fullPath} class="fd-horizontal-menu__item">
          {renderIcon(menu.icon, MENU_CONFIG.ICON_SIZE)}
          {renderTitle(menu.title)}
        </ElMenuItem>
      )
    }

    /** 渲染子菜单（有子菜单项） */
    function renderSubMenu(menu: Menu, fullPath: string, level: number = 0) {
      const popperClass = level === 0 ? "fd-horizontal-menu__popper" : "fd-horizontal-menu__popper--nested"

      return (
        <ElSubMenu key={menu.path} index={fullPath} class="fd-horizontal-menu__submenu" popperClass={popperClass}>
          {{
            title: () => (
              <>
                {renderIcon(menu.icon, MENU_CONFIG.ICON_SIZE)}
                {renderTitle(menu.title)}
              </>
            ),
            default: () => menu.children?.map((child: Menu) => renderMenuItem(child, fullPath, level + 1)),
          }}
        </ElSubMenu>
      )
    }

    /** 递归渲染菜单项 */
    function renderMenuItem(menu: Menu, basePath: string, level: number = 0) {
      const fullPath = getFullPath(menu.path, basePath)

      // 过滤隐藏的菜单
      if (menu.hidden) return null

      // 无子菜单，渲染叶子节点
      if (!menu.children || menu.children.length === 0) {
        return renderLeafMenuItem(menu, fullPath)
      }

      // 只有一个可提升的子项
      if (isSinglePromotableChild(menu)) {
        const firstChild = menu.children[0]!
        const childFullPath = getFullPath(firstChild.path, fullPath)
        return (
          <ElMenuItem key={childFullPath} index={childFullPath} class="fd-horizontal-menu__item">
            {renderIcon(firstChild.meta?.icon || menu.icon, MENU_CONFIG.ICON_SIZE)}
            {renderTitle(firstChild.meta?.title || menu.title)}
          </ElMenuItem>
        )
      }

      // 有多个子菜单
      return renderSubMenu(menu, fullPath, level)
    }

    /** 渲染水平菜单 */
    function renderHorizontalMenu() {
      return (
        <div class="fd-horizontal-menu">
          <ElMenu
            class="fd-horizontal-menu__container"
            mode="horizontal"
            ellipsis={true}
            showTimeout={50}
            hideTimeout={500000}
            popperOffset={-6}
            defaultActive={activeMenuPath.value}
            uniqueOpened={isAccordionMode.value}
            backgroundColor="transparent"
            textColor="var(--el-text-color-primary)"
            activeTextColor="var(--el-color-primary)"
            popperClass="fd-horizontal-menu__popper"
            onSelect={handleMenuSelect}
          >
            {filteredMenus.value.map((menu) => renderMenuItem(menu, "", 0))}
          </ElMenu>
        </div>
      )
    }

    return () => renderHorizontalMenu()
  },
})
