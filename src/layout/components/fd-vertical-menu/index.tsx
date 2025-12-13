import type { BackendMenu } from "./types"
import type { CSSProperties } from "vue"
import FdLogo from "../fd-logo/index.vue"
import { Icon } from "@/components/core/fd-icon"
import { useAppStore } from "@/stores/app"
import { useMenuStore } from "@/stores/menu"
import { useSettingsStore } from "@/stores/settings"
import { useRoute, useRouter } from "vue-router"
import { ref, watch, computed, defineComponent } from "vue"
import { ElMenu, ElSubMenu, ElTooltip, ElMenuItem, ElScrollbar } from "element-plus"
import "./index.scss"

/** 菜单配置常量 */
const MENU_CONFIG = {
  /** 一级菜单图标大小 */
  FIRST_LEVEL_ICON_SIZE: 20,
  /** 子菜单图标大小 */
  SUB_MENU_ICON_SIZE: 18,
  /** 一级菜单宽度（仅图标） */
  FIRST_LEVEL_WIDTH: 62,
} as const

// ==================== 组件定义 ====================

export default defineComponent({
  name: "fd-vertical-menu",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const appStore = useAppStore()
    const menuStore = useMenuStore()
    const settingsStore = useSettingsStore()

    // ==================== 响应式状态 ====================

    /** 当前选中的一级菜单路径（双列模式使用） */
    const activeFirstLevelPath = ref<string>("")

    // ==================== 计算属性 ====================

    /** 是否为双列布局模式 */
    const isDualMode = computed<boolean>(() => settingsStore.isDualLayout)

    /** 可见菜单列表 */
    const menuList = computed<BackendMenu[]>(() => menuStore.visibleMenus)

    /** 菜单是否折叠（优先使用 prop，否则使用 store） */
    const isCollapsed = computed<boolean>(() => settingsStore.isMenuCollapsed)

    /** 菜单是否使用手风琴模式 */
    const isAccordionMode = computed<boolean>(() => appStore.menuMode === "accordion")

    /** 当前激活的菜单路径 */
    const activeMenuPath = computed<string>(() => {
      if (route.meta.activeMenu) {
        return route.meta.activeMenu as string
      }
      return route.path
    })

    /** 菜单容器样式（根据折叠状态动态设置宽度） */
    const style = computed<CSSProperties>(() => ({
      "--menu-expand-width": `${settingsStore.menuExpandWidth}px`,
      "--menu-collapse-width": `${settingsStore.menuCollapseWidth}px`,
    }))

    // ========== 双列模式专用计算属性 ==========

    /** 一级菜单列表（双列模式） */
    const firstLevelMenus = computed<BackendMenu[]>(() => menuList.value)

    /** 当前一级菜单对应的子菜单 */
    const currentSubMenus = computed<BackendMenu[]>(() => {
      if (!activeFirstLevelPath.value) return []
      const currentMenu = firstLevelMenus.value.find((menu) => menu.path === activeFirstLevelPath.value)
      return currentMenu?.children || []
    })

    /** 是否有子菜单可显示 */
    const hasSubMenus = computed<boolean>(() => currentSubMenus.value.length > 0)

    /** 一级菜单容器样式 */
    const firstLevelStyle = computed<CSSProperties>(() => ({
      width: `${MENU_CONFIG.FIRST_LEVEL_WIDTH}px`,
      flexShrink: 0,
    }))

    /** 二级菜单容器样式（双列模式） */
    const secondColumnStyle = computed<CSSProperties>(() => ({
      width: `${settingsStore.menuExpandWidth}px`,
      flexShrink: 0,
    }))

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
    function isSinglePromotableChild(menu: BackendMenu): boolean {
      if (!menu.children || menu.children.length !== 1) return false
      return !menu.children[0]?.children?.length
    }

    /** 判断一级菜单是否激活（双列模式） */
    function isFirstLevelActive(menu: BackendMenu): boolean {
      if (!menu.children?.length) {
        return menu.path === route.path
      }
      return menu.path === activeFirstLevelPath.value
    }

    // ==================== 初始化（双列模式） ====================

    /** 根据当前路由初始化一级菜单选中状态 */
    function initActiveFirstLevel(): void {
      const currentPath = route.path
      const matchedMenu = firstLevelMenus.value.find((menu) => {
        if (menu.path === currentPath) return true
        if (currentPath.startsWith(`${menu.path}/`)) return true
        return false
      })
      if (matchedMenu) {
        activeFirstLevelPath.value = matchedMenu.path
      }
      else if (firstLevelMenus.value.length > 0) {
        activeFirstLevelPath.value = firstLevelMenus.value[0]!.path
      }
    }

    // 监听路由变化，更新一级菜单激活状态
    watch(
      () => route.path,
      () => {
        if (isDualMode.value) {
          initActiveFirstLevel()
        }
      },
      { immediate: true },
    )

    // ==================== 事件处理 ====================

    /** 菜单选择处理（单列模式） */
    function handleMenuSelect(path: string): void {
      if (isExternalLink(path)) {
        window.open(path, "_blank", "noopener,noreferrer")
        return
      }
      router.push(path)
    }

    /** 一级菜单点击处理（双列模式） */
    function handleFirstLevelClick(menu: BackendMenu): void {
      if (!menu.children?.length) {
        handleMenuSelect(menu.path)
        return
      }
      activeFirstLevelPath.value = menu.path
    }

    /** 二级菜单选择处理（双列模式） */
    function handleSubMenuSelect(path: string): void {
      handleMenuSelect(path)
    }

    // ==================== 渲染函数 ====================

    /** 渲染菜单图标 */
    function renderIcon(icon?: string, size: number = MENU_CONFIG.SUB_MENU_ICON_SIZE) {
      if (!icon) return null
      return <Icon icon={icon} size={size} />
    }

    /** 渲染菜单标题 */
    function renderTitle(title?: string) {
      return <span class="fd-menu__title">{title || "未命名菜单"}</span>
    }

    /** 渲染叶子菜单项（无子菜单） */
    function renderLeafMenuItem(menu: BackendMenu, fullPath: string) {
      return (
        <ElMenuItem key={menu.path} index={fullPath} class="fd-menu__item">
          {renderIcon(menu.meta?.icon)}
          {renderTitle(menu.meta?.title)}
        </ElMenuItem>
      )
    }

    /** 渲染子菜单（有子菜单项） */
    function renderSubMenu(menu: BackendMenu, fullPath: string) {
      return (
        <ElSubMenu key={menu.path} index={fullPath} class="fd-menu__submenu">
          {{
            title: () => (
              <>
                {renderIcon(menu.meta?.icon)}
                {renderTitle(menu.meta?.title)}
              </>
            ),
            default: () => menu.children?.map((child: BackendMenu) => renderMenuItem(child, fullPath)),
          }}
        </ElSubMenu>
      )
    }

    /** 递归渲染菜单项 */
    function renderMenuItem(menu: BackendMenu, basePath: string) {
      const fullPath = getFullPath(menu.path, basePath)

      if (!menu.children || menu.children.length === 0) {
        return renderLeafMenuItem(menu, fullPath)
      }

      if (isSinglePromotableChild(menu)) {
        const firstChild = menu.children[0]!
        const childFullPath = getFullPath(firstChild.path, fullPath)
        return (
          <ElMenuItem key={childFullPath} index={childFullPath} class="fd-menu__item">
            {renderIcon(firstChild.meta?.icon || menu.meta?.icon)}
            {renderTitle(firstChild.meta?.title || menu.meta?.title)}
          </ElMenuItem>
        )
      }

      return renderSubMenu(menu, fullPath)
    }

    // ========== 双列模式渲染函数 ==========

    /** 渲染一级菜单项（双列模式） */
    function renderFirstLevelItem(menu: BackendMenu) {
      const isActive = isFirstLevelActive(menu)

      const itemContent = (
        <div class={["fd-menu-dual__first-item", { "is-active": isActive }]} onClick={() => handleFirstLevelClick(menu)}>
          {renderIcon(menu.meta?.icon, MENU_CONFIG.FIRST_LEVEL_ICON_SIZE)}
        </div>
      )

      return (
        <ElTooltip key={menu.path} content={menu.meta?.title} placement="right" offset={12} hideAfter={0}>
          {itemContent}
        </ElTooltip>
      )
    }

    /** 渲染一级菜单列表（双列模式） */
    function renderFirstLevelMenu() {
      return (
        <div class="fd-menu-dual__first" style={firstLevelStyle.value}>
          <FdLogo />
          <ElScrollbar>
            <div class="fd-menu-dual__first-menu">{firstLevelMenus.value.map((menu) => renderFirstLevelItem(menu))}</div>
          </ElScrollbar>
        </div>
      )
    }

    /** 渲染子菜单项（双列模式） */
    function renderDualSubMenuItem(menu: BackendMenu, basePath: string) {
      const fullPath = getFullPath(menu.path, basePath)

      if (!menu.children || menu.children.length === 0) {
        return (
          <ElMenuItem key={menu.path} index={fullPath} class="fd-menu-dual__sub-item">
            {renderIcon(menu.meta?.icon)}
            <span>{menu.meta?.title}</span>
          </ElMenuItem>
        )
      }

      if (isSinglePromotableChild(menu)) {
        const firstChild = menu.children[0]!
        const childFullPath = getFullPath(firstChild.path, fullPath)
        return (
          <ElMenuItem key={childFullPath} index={childFullPath} class="fd-menu-dual__sub-item">
            {renderIcon(firstChild.meta?.icon || menu.meta?.icon)}
            <span>{firstChild.meta?.title || menu.meta?.title}</span>
          </ElMenuItem>
        )
      }

      return (
        <ElSubMenu key={menu.path} index={fullPath} class="fd-menu-dual__submenu">
          {{
            title: () => (
              <>
                {renderIcon(menu.meta?.icon)}
                <span>{menu.meta?.title}</span>
              </>
            ),
            default: () => menu.children?.map((child: BackendMenu) => renderDualSubMenuItem(child, fullPath)),
          }}
        </ElSubMenu>
      )
    }

    /** 渲染二级菜单列表（双列模式） */
    function renderSubMenuList() {
      const appTitle = import.meta.env.VITE_APP_TITLE

      return (
        <div class="fd-menu-dual__second" style={secondColumnStyle.value}>
          {/* 项目名称标题 */}
          <div class="fd-menu-dual__header">
            <h1 class="fd-menu-dual__title">{appTitle}</h1>
          </div>
          {hasSubMenus.value && (
            <ElScrollbar class="fd-menu-dual__second-scroll">
              <ElMenu
                class="fd-menu-dual__menu"
                defaultActive={activeMenuPath.value}
                collapseTransition={false}
                uniqueOpened={isAccordionMode.value}
                backgroundColor="transparent"
                textColor="#303133"
                activeTextColor="var(--el-color-primary)"
                onSelect={handleSubMenuSelect}
              >
                {currentSubMenus.value.map((menu) => renderDualSubMenuItem(menu, activeFirstLevelPath.value))}
              </ElMenu>
            </ElScrollbar>
          )}
        </div>
      )
    }

    /** 渲染双列布局 */
    function renderDualColumnLayout() {
      return (
        <div class="fd-vertical-menu fd-menu-dual" style={style.value}>
          {renderFirstLevelMenu()}
          {renderSubMenuList()}
        </div>
      )
    }

    function renderSingleColumnLayout() {
      return (
        <div class="fd-vertical-menu" style={style.value}>
          <ElScrollbar class="fd-menu">
            <ElMenu
              class="fd-menu__container"
              showTimeout={50}
              hideTimeout={50}
              defaultActive={activeMenuPath.value}
              collapse={isCollapsed.value}
              uniqueOpened={isAccordionMode.value}
              backgroundColor="transparent"
              textColor="#303133"
              onSelect={handleMenuSelect}
            >
              {menuList.value.map((menu) => renderMenuItem(menu, ""))}
            </ElMenu>
          </ElScrollbar>
        </div>

      )
    }

    return () => (isDualMode.value ? renderDualColumnLayout() : renderSingleColumnLayout())
  },
})
