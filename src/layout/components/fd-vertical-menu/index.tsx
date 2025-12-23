import type { Menu } from "@/stores"
import type { CSSProperties } from "vue"
import FdLogo from "../fd-logo/index.vue"
import FdName from "../fd-name/index.vue"
import FdIcon from "@/components/core/fd-icon"
import { useMitt } from "@/hooks"
import { useRoute, useRouter } from "vue-router"
import { useMenuStore, useDeviceStore, useSettingsStore } from "@/stores"

import { ref, watch, computed, onMounted, onUnmounted, defineComponent } from "vue"
import { ElMenu, ElDrawer, ElSubMenu, ElTooltip, ElMenuItem, ElScrollbar } from "element-plus"
import "./index.scss"

export default defineComponent({
  name: "fd-vertical-menu",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const menuStore = useMenuStore()
    const deviceStore = useDeviceStore()
    const settingsStore = useSettingsStore()
    const mitt = useMitt("layout")

    /** 移动端抽屉菜单可见状态 */
    const mobileMenuOpen = ref<boolean>(false)

    /** 是否为移动端设备 */
    const isMobile = computed<boolean>(() => deviceStore.isMobile)

    /** 是否为双列布局模式 */
    const isDualMode = computed<boolean>(() => settingsStore.isDualLayout)

    /** 是否为混合布局模式 */
    const isMixedMode = computed<boolean>(() => settingsStore.isMixedLayout)

    /** 可见菜单列表 */
    const menuList = computed<Menu[]>(() => menuStore.menus)

    /** 菜单是否折叠（优先使用 prop，否则使用 store） */
    const isCollapsed = computed<boolean>(() => settingsStore.isMenuCollapsed)

    /** 菜单是否使用手风琴模式 */
    const isAccordionMode = computed<boolean>(() => settingsStore.menuMode === "accordion")

    /** 当前激活的菜单路径 */
    const activeMenuPath = computed<string>(() => {
      if (typeof route.meta.activeMenu === "string" && route.meta.activeMenu.length > 0) {
        return route.meta.activeMenu
      }
      return route.path
    })

    /** 一级菜单列表 */
    const firstLevelMenus = computed<Menu[]>(() => menuList.value)

    /** 当前选中的一级菜单路径（使用 store 统一管理） */
    const activeFirstLevelPath = computed<string>(() => menuStore.activeFirstLevelPath)

    /** 当前一级菜单对应的子菜单（双列/混合模式共用） */
    const currentSubMenus = computed<Menu[]>(() => {
      if (!activeFirstLevelPath.value) return []
      const currentMenu = firstLevelMenus.value.find((menu) => menu.path === activeFirstLevelPath.value)
      return currentMenu?.children || []
    })

    /** 是否有子菜单可显示 */
    const hasSubMenus = computed<boolean>(() => currentSubMenus.value.length > 0)

    /** 右侧菜单容器样式（双列模式） */
    const rightColumnStyle = computed<CSSProperties>(() => ({
      width: `${settingsStore.menuExpandWidth}px`,
      flexShrink: 0,
    }))

    /** 菜单容器类名（仅保留有样式定义的修饰符） */
    const containerClass = computed(() => [
      "fd-vertical-menu",
      { "fd-vertical-menu--dual": isDualMode.value },
    ])

    // 监听路由变化，更新一级菜单激活状态（双列/混合模式共用）
    watch(
      () => route.path,
      (path) => {
        if (isDualMode.value || isMixedMode.value) {
          menuStore.initActiveFirstLevel(path)
        }
      },
      { immediate: true },
    )

    // 监听布局模式变化，切换到双列/混合模式时初始化一级菜单
    watch(
      [isDualMode, isMixedMode],
      ([dual, mixed]) => {
        if (dual || mixed) {
          menuStore.initActiveFirstLevel(route.path)
        }
      },
    )

    onMounted(() => {
      mitt.on("mobile-menu:open", handleOpenMobileMenu)
    })

    onUnmounted(() => {
      mitt.off("mobile-menu:open", handleOpenMobileMenu)
    })

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

    function handleOpenMobileMenu() {
      mobileMenuOpen.value = true
    }

    function handleCloseMobileMenu() {
      mobileMenuOpen.value = false
    }

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
      menuStore.setActiveFirstLevelPath(menu.path)
    }

    /** 二级菜单选择处理（双列模式） */
    function handleSubMenuSelect(path: string): void {
      handleMenuSelect(path)
    }

    /** 渲染菜单图标 */
    function renderIcon(icon?: string) {
      if (!icon) return null
      return <FdIcon icon={icon} size="20" class="fd-vertical-menu__icon" />
    }

    /** 渲染菜单标题 */
    function renderMenuTitle(title?: string) {
      return <span class="fd-vertical-menu__title">{title}</span>
    }

    /** 渲染叶子菜单项（无子菜单） */
    function renderLeafMenuItem(menu: Menu, fullPath: string) {
      return (
        <div class="fd-vertical-menu__item" key={fullPath}>
          <ElMenuItem index={fullPath}>
            {renderIcon(menu.icon)}
            {renderMenuTitle(menu.title)}
          </ElMenuItem>
        </div>
      )
    }

    /** 渲染子菜单（有子菜单项） */
    function renderSubMenu(menu: Menu, fullPath: string) {
      return (
        <ElSubMenu key={fullPath} index={fullPath}>
          {{
            title: () => (
              <>
                {renderIcon(menu.icon)}
                {renderMenuTitle(menu.title)}
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
    function renderDualLeftMenuItem(menu: Menu) {
      const isActive = isFirstLevelActive(menu)

      const itemContent = (
        <button
          type="button"
          class={["fd-vertical-menu__left-item", { "is-active": isActive }]}
          aria-label={menu.title}
          onClick={() => handleFirstLevelClick(menu)}
        >
          {renderIcon(menu.icon)}
        </button>
      )

      return (
        <ElTooltip key={menu.path} content={menu.title} placement="right" offset={12} hideAfter={0}>
          {itemContent}
        </ElTooltip>
      )
    }

    /** 渲染 Logo 组件 */
    function renderSystemLogo() {
      return <FdLogo />
    }

    /** 渲染系统名称组件 */
    function renderSystemName() {
      return <FdName />
    }

    /** 渲染标准头部（Logo + Name） */
    function renderStandardHeader() {
      return (
        <div class="fd-vertical-menu__header">
          <div class="fd-vertical-menu__header-inner">
            {renderSystemLogo()}
            {isCollapsed.value ? null : renderSystemName()}
          </div>
        </div>
      )
    }

    /** 渲染单列模式菜单 */
    function renderSingleMenu() {
      return (
        <div class="fd-vertical-menu__list">
          <ElMenu
            showTimeout={50}
            hideTimeout={50}
            defaultActive={activeMenuPath.value}
            collapse={isCollapsed.value}
            uniqueOpened={isAccordionMode.value}
            popperClass="fd-vertical-menu__popper"
            onSelect={handleMenuSelect}
          >
            {menuList.value.map(menu => renderMenuItem(menu, ""))}
          </ElMenu>
        </div>
      )
    }

    /** 渲染单列布局 */
    function renderSingleLayout() {
      return (
        <>
          {renderStandardHeader()}
          {renderSingleMenu()}
        </>
      )
    }

    /** 渲染混合模式菜单（显示二级菜单） */
    function renderMixedMenu() {
      if (!hasSubMenus.value) return null
      return (
        <ElScrollbar>
          <div class="fd-vertical-menu__list">
            <ElMenu
              showTimeout={50}
              hideTimeout={50}
              defaultActive={activeMenuPath.value}
              collapse={isCollapsed.value}
              uniqueOpened={isAccordionMode.value}
              popperClass="fd-vertical-menu__popper"
              onSelect={handleMenuSelect}
            >
              {currentSubMenus.value.map((menu: Menu) => renderMenuItem(menu, menuStore.activeFirstLevelPath))}
            </ElMenu>
          </div>
        </ElScrollbar>
      )
    }

    /** 渲染混合模式布局（包含 header） */
    function renderMixedLayout() {
      return (
        <>
          {renderStandardHeader()}
          {renderMixedMenu()}
        </>
      )
    }

    /** 渲染双列左侧头部（仅 Logo） */
    function renderDualLeftHeader() {
      return (
        <div class="fd-vertical-menu__header">
          {renderSystemLogo()}
        </div>
      )
    }

    /** 渲染双列左侧菜单列表 */
    function renderDualLeftMenu() {
      return (
        <ElScrollbar>
          <div class="fd-vertical-menu__left-menu">
            {firstLevelMenus.value.map(menu => renderDualLeftMenuItem(menu))}
          </div>
        </ElScrollbar>
      )
    }

    /** 渲染左侧区域（双列模式） */
    function renderDualLeft() {
      return (
        <div class="fd-vertical-menu__left">
          {renderDualLeftHeader()}
          {renderDualLeftMenu()}
        </div>
      )
    }

    /** 渲染双列右侧头部（仅 Name） */
    function renderDualRightHeader() {
      return (
        <div class="fd-vertical-menu__right-header">
          {renderSystemName()}
        </div>
      )
    }

    /** 渲染右侧菜单项（双列模式） */
    function renderDualRightMenuItem(menu: Menu, basePath: string) {
      const fullPath = getFullPath(menu.path, basePath)

      // 没有子菜单，渲染为叶子菜单项
      if (!menu.children || menu.children.length === 0) {
        return (
          <div class="fd-vertical-menu__item" key={fullPath}>
            <ElMenuItem index={fullPath}>
              {renderIcon(menu.icon)}
              {renderMenuTitle(menu.title)}
            </ElMenuItem>
          </div>
        )
      }

      // 有子菜单，渲染为可展开的子菜单
      return (
        <ElSubMenu key={fullPath} index={fullPath} class="fd-vertical-menu__right-submenu">
          {{
            title: () => (
              <>
                {renderIcon(menu.icon)}
                {renderMenuTitle(menu.title)}
              </>
            ),
            default: () => menu.children?.map((child: Menu) => renderDualRightMenuItem(child, fullPath)),
          }}
        </ElSubMenu>
      )
    }

    /** 渲染双列右侧菜单（含滚动容器） */
    function renderDualRightMenu() {
      if (!hasSubMenus.value) return null
      return (
        <ElScrollbar>
          <div class="fd-vertical-menu__list">
            <ElMenu
              class="fd-vertical-menu__right-menu"
              defaultActive={activeMenuPath.value}
              collapseTransition={false}
              uniqueOpened={isAccordionMode.value}
              backgroundColor="transparent"
              onSelect={handleSubMenuSelect}
            >
              {currentSubMenus.value.map(menu => renderDualRightMenuItem(menu, activeFirstLevelPath.value))}
            </ElMenu>
          </div>
        </ElScrollbar>
      )
    }

    /** 渲染右侧区域（双列模式） */
    function renderDualRight() {
      return (
        <div class="fd-vertical-menu__right" style={rightColumnStyle.value}>
          {renderDualRightHeader()}
          {renderDualRightMenu()}
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

    /** 渲染移动端抽屉菜单 */
    function renderMobileDrawer() {
      return (
        <ElDrawer
          modelValue={mobileMenuOpen.value}
          direction="ltr"
          size="auto"
          withHeader={false}
          showClose={false}
          modal={true}
          class="fd-vertical-menu__drawer"
          onClose={handleCloseMobileMenu}
        >
          <div class={containerClass.value}>
            {isDualMode.value ? renderDualLayout() : renderSingleLayout()}
          </div>
        </ElDrawer>
      )
    }

    /** 渲染桌面端菜单 */
    function renderDesktopMenu() {
      // 混合模式下只显示二级菜单
      if (isMixedMode.value) {
        if (!hasSubMenus.value) return null
        return (
          <div class={containerClass.value}>
            {renderMixedLayout()}
          </div>
        )
      }
      return (
        <div class={containerClass.value}>
          {isDualMode.value ? renderDualLayout() : renderSingleLayout()}
        </div>
      )
    }

    return () => (isMobile.value ? renderMobileDrawer() : renderDesktopMenu())
  },
})
