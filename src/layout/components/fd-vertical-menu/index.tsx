import type { Menu } from "@/stores"
import type { CSSProperties } from "vue"
import FdLogo from "../fd-logo/index.vue"
import FdName from "../fd-name/index.vue"
import FdIcon from "@/components/core/fd-icon"

import { useMenuStore } from "@/stores"
import { useSettingsStore } from "@/stores"
import { useRoute, useRouter } from "vue-router"
import { ref, watch, computed, defineComponent } from "vue"
import { ElMenu, ElSubMenu, ElTooltip, ElMenuItem, ElScrollbar } from "element-plus"
import "./index.scss"

export default defineComponent({
  name: "fd-vertical-menu",
  setup() {
    const route = useRoute()
    const router = useRouter()

    const menuStore = useMenuStore()
    const settingsStore = useSettingsStore()

    /** 当前选中的一级菜单路径（双列模式使用） */
    const activeFirstLevelPath = ref<string>("")

    /** 是否为双列布局模式 */
    const isDualMode = computed<boolean>(() => settingsStore.isDualLayout)

    /** 可见菜单列表 */
    const menuList = computed<Menu[]>(() => menuStore.menus)

    /** 菜单是否折叠（优先使用 prop，否则使用 store） */
    const isCollapsed = computed<boolean>(() => settingsStore.isMenuCollapsed)

    /** 菜单是否使用手风琴模式 */
    const isAccordionMode = computed<boolean>(() => settingsStore.menuMode === "accordion")

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

    /** 一级菜单列表（双列模式） */
    const firstLevelMenus = computed<Menu[]>(() => menuList.value)

    /** 当前一级菜单对应的子菜单 */
    const currentSubMenus = computed<Menu[]>(() => {
      if (!activeFirstLevelPath.value) return []
      const currentMenu = firstLevelMenus.value.find((menu) => menu.path === activeFirstLevelPath.value)
      return currentMenu?.children || []
    })

    /** 是否有子菜单可显示 */
    const hasSubMenus = computed<boolean>(() => currentSubMenus.value.length > 0)

    /** 左侧菜单容器样式 */
    const leftColumnStyle = computed<CSSProperties>(() => ({
      width: "62px",
      flexShrink: 0,
    }))

    /** 右侧菜单容器样式（双列模式） */
    const rightColumnStyle = computed<CSSProperties>(() => ({
      width: `${settingsStore.menuExpandWidth}px`,
      flexShrink: 0,
    }))

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

    /** 判断一级菜单是否激活（双列模式） */
    function isFirstLevelActive(menu: Menu): boolean {
      if (!menu.children?.length) {
        return menu.path === route.path
      }
      return menu.path === activeFirstLevelPath.value
    }

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

    /** 菜单选择处理（单列模式） */
    function handleMenuSelect(path: string): void {
      if (isExternalLink(path)) {
        window.open(path, "_blank", "noopener,noreferrer")
        return
      }
      router.push(path)
    }

    /** 一级菜单点击处理（双列模式） */
    function handleFirstLevelClick(menu: Menu): void {
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

    /** 渲染菜单图标 */
    function renderIcon(icon?: string, size: number = 18) {
      if (!icon) return null
      return <FdIcon icon={icon} size={size} class="fd-menu__icon" />
    }

    /** 渲染菜单标题 */
    function renderTitle(title?: string) {
      return <span class="fd-menu__title">{title || "未命名菜单"}</span>
    }

    /** 渲染叶子菜单项（无子菜单） */
    function renderLeafMenuItem(menu: Menu, fullPath: string) {
      return (
        <ElMenuItem key={menu.path} index={fullPath} class="fd-menu__item">
          {renderIcon(menu.icon)}
          {renderTitle(menu.title)}
        </ElMenuItem>
      )
    }

    /** 渲染子菜单（有子菜单项） */
    function renderSubMenu(menu: Menu, fullPath: string) {
      return (
        <ElSubMenu key={menu.path} index={fullPath} class="fd-menu__submenu">
          {{
            title: () => (
              <>
                {renderIcon(menu.icon)}
                {renderTitle(menu.title)}
              </>
            ),
            default: () => menu.children?.map((child: Menu) => renderMenuItem(child, fullPath)),
          }}
        </ElSubMenu>
      )
    }

    /** 递归渲染菜单项 */
    function renderMenuItem(menu: Menu, basePath: string) {
      const fullPath = getFullPath(menu.path, basePath)

      // 没有子菜单，渲染为叶子菜单项
      if (!menu.children || menu.children.length === 0) {
        return renderLeafMenuItem(menu, fullPath)
      }

      // 有子菜单，渲染为可展开的子菜单
      return renderSubMenu(menu, fullPath)
    }

    /** 渲染左侧菜单项（双列模式） */
    function renderDualLeftItem(menu: Menu) {
      const isActive = isFirstLevelActive(menu)

      const itemContent = (
        <div class={["fd-vertical-menu__left-item", { "is-active": isActive }]} onClick={() => handleFirstLevelClick(menu)}>
          {renderIcon(menu.icon, 20)}
        </div>
      )

      return (
        <ElTooltip key={menu.path} content={menu.title} placement="right" offset={12} hideAfter={0}>
          {itemContent}
        </ElTooltip>
      )
    }

    /** 渲染左侧区域（双列模式） */
    function renderDualLeft() {
      return (
        <div class="fd-vertical-menu__left" style={leftColumnStyle.value}>
          <div class="fd-vertical-menu__left-header">
            <FdLogo />
          </div>
          <ElScrollbar>
            <div class="fd-vertical-menu__left-menu">{firstLevelMenus.value.map((menu) => renderDualLeftItem(menu))}</div>
          </ElScrollbar>
        </div>
      )
    }

    /** 渲染头部区域（单列模式） */
    function renderSingleHeader() {
      return (
        <div class="fd-vertical-menu__header">
          <div class="fd-vertical-menu__header__inner">
            <FdLogo />
            {isCollapsed.value ? null : <FdName />}
          </div>
        </div>
      )
    }

    /** 渲染右侧菜单项（双列模式） */
    function renderDualRightItem(menu: Menu, basePath: string) {
      const fullPath = getFullPath(menu.path, basePath)

      // 没有子菜单，渲染为叶子菜单项
      if (!menu.children || menu.children.length === 0) {
        return (
          <ElMenuItem key={menu.path} index={fullPath} class="fd-vertical-menu__right-item">
            {renderIcon(menu.icon)}
            <span>{menu.title}</span>
          </ElMenuItem>
        )
      }

      // 有子菜单，渲染为可展开的子菜单
      return (
        <ElSubMenu key={menu.path} index={fullPath} class="fd-vertical-menu__right-submenu">
          {{
            title: () => (
              <>
                {renderIcon(menu.icon)}
                <span>{menu.title}</span>
              </>
            ),
            default: () => menu.children?.map((child: Menu) => renderDualRightItem(child, fullPath)),
          }}
        </ElSubMenu>
      )
    }

    /** 渲染右侧区域（双列模式） */
    function renderDualRight() {
      return (
        <div class="fd-vertical-menu__right" style={rightColumnStyle.value}>
          {/* 右侧头部 */}
          <div class="fd-vertical-menu__right-header">
            <FdName />
          </div>
          {hasSubMenus.value && (
            <ElScrollbar class="fd-vertical-menu__right-scroll">
              <ElMenu
                class="fd-vertical-menu__right-menu"
                defaultActive={activeMenuPath.value}
                collapseTransition={false}
                uniqueOpened={isAccordionMode.value}
                backgroundColor="transparent"
                onSelect={handleSubMenuSelect}
              >
                {currentSubMenus.value.map((menu) => renderDualRightItem(menu, activeFirstLevelPath.value))}
              </ElMenu>
            </ElScrollbar>
          )}
        </div>
      )
    }

    /** 渲染双列布局 */
    function renderDualLayout() {
      return (
        <>
          {renderDualLeft()}
          {renderDualRight()}
        </>
      )
    }

    /** 渲染单列布局 */
    function renderSingleLayout() {
      return (
        <>
          {renderSingleHeader()}
          <ElScrollbar>
            <ElMenu
              showTimeout={50}
              hideTimeout={50000}
              defaultActive={activeMenuPath.value}
              collapse={isCollapsed.value}
              uniqueOpened={isAccordionMode.value}
              popperClass="fd-vertical-menu__popper"
              onSelect={handleMenuSelect}
            >
              {menuList.value.map((menu) => renderMenuItem(menu, ""))}
            </ElMenu>
          </ElScrollbar>
        </>
      )
    }

    /** 移动端菜单状态（由父组件注入） */
    const mobileMenuOpen = inject("mobileMenuOpen", ref(false))
    const closeMobileMenu = inject<() => void>("closeMobileMenu")

    /** 关闭移动端菜单 */
    function handleClose() {
      closeMobileMenu?.()
    }

    /** 菜单容器类名（根据布局模式添加修饰符） */
    const containerClass = computed(() => [
      "fd-vertical-menu",
      `fd-vertical-menu--${settingsStore.menuLayout}`,
      { "is-open": mobileMenuOpen.value },
    ])

    return () => (
      <div class={containerClass.value} style={style.value}>
        {isDualMode.value ? renderDualLayout() : renderSingleLayout()}
        <div class="menu-model" onClick={handleClose} />
      </div>
    )
  },
})
