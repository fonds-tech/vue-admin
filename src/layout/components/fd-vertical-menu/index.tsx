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

    // ==================== 响应式状态 ====================

    /** mobile drawer visibility */
    const mobileMenuOpen = ref<boolean>(false)

    // ==================== 计算属性 ====================

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
      if (route.meta.activeMenu) {
        return route.meta.activeMenu as string
      }
      return route.path
    })

    /** 一级菜单列表 */
    const firstLevelMenus = computed<Menu[]>(() => menuList.value)

    /** 当前选中的一级菜单路径（使用 store 统一管理） */
    const activeFirstLevelPath = computed<string>(() => menuStore.activeFirstLevelPath)

    /** 当前一级菜单对应的子菜单（双列/混合模式共用） */
    const currentSubMenus = computed<Menu[]>(() => menuStore.currentSubMenus)

    /** 是否有子菜单可显示 */
    const hasSubMenus = computed<boolean>(() => currentSubMenus.value.length > 0)

    /** 右侧菜单容器样式（双列模式） */
    const rightColumnStyle = computed<CSSProperties>(() => ({
      width: `${settingsStore.menuExpandWidth}px`,
      flexShrink: 0,
    }))

    /** 菜单容器类名（根据布局模式添加修饰符） */
    const containerClass = computed(() => [
      "fd-vertical-menu",
      `fd-vertical-menu--${settingsStore.menuLayout}`,
    ])

    // ==================== 监听器 ====================

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

    // ==================== 生命周期 ====================

    onMounted(() => {
      mitt.on("mobile-menu:open", handleOpenMobileMenu)
    })

    onUnmounted(() => {
      mitt.off("mobile-menu:open", handleOpenMobileMenu)
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

    /** 判断一级菜单是否激活（双列模式） */
    function isFirstLevelActive(menu: Menu): boolean {
      if (!menu.children?.length) {
        return menu.path === route.path
      }
      return menu.path === activeFirstLevelPath.value
    }

    // ==================== 事件处理 ====================

    function handleOpenMobileMenu() {
      mobileMenuOpen.value = true
    }

    function handleClose() {
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

    // ==================== 渲染函数 ====================

    /** 渲染菜单图标 */
    function renderIcon(icon?: string) {
      if (!icon) return null
      return <FdIcon icon={icon} class="fd-vertical-menu__icon" />
    }

    /** 渲染菜单标题 */
    function renderTitle(title?: string) {
      return <span class="fd-vertical-menu__title">{title}</span>
    }

    /** 渲染叶子菜单项（无子菜单） */
    function renderLeafMenuItem(menu: Menu, fullPath: string) {
      return (
        <ElMenuItem key={menu.path} index={fullPath} class="fd-vertical-menu__item">
          {renderIcon(menu.icon)}
          {renderTitle(menu.title)}
        </ElMenuItem>
      )
    }

    /** 渲染子菜单（有子菜单项） */
    function renderSubMenu(menu: Menu, fullPath: string) {
      return (
        <ElSubMenu key={menu.path} index={fullPath} class="fd-vertical-menu__submenu">
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
        <div class={["fd-vertical-menu__left__item", { "is-active": isActive }]} onClick={() => handleFirstLevelClick(menu)}>
          {renderIcon(menu.icon)}
        </div>
      )

      return (
        <ElTooltip key={menu.path} content={menu.title} placement="right" offset={12} hideAfter={0}>
          {itemContent}
        </ElTooltip>
      )
    }

    // ==================== 基础元素渲染函数 ====================

    /** 渲染 Logo 组件 */
    function renderLogo() {
      return <FdLogo />
    }

    /** 渲染系统名称组件 */
    function renderName() {
      return <FdName />
    }

    // ==================== 单列模式渲染函数 ====================

    /** 渲染单列模式头部（Logo + Name） */
    function renderSingleHeader() {
      return (
        <div class="fd-vertical-menu__header">
          <div class="fd-vertical-menu__header__inner">
            {renderLogo()}
            {isCollapsed.value ? null : renderName()}
          </div>
        </div>
      )
    }

    /** 渲染单列模式菜单（含滚动容器） */
    function renderSingleMenu() {
      return (
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
            {menuList.value.map(menu => renderMenuItem(menu, ""))}
          </ElMenu>
        </ElScrollbar>
      )
    }

    /** 渲染单列布局 */
    function renderSingleLayout() {
      return (
        <>
          {renderSingleHeader()}
          {renderSingleMenu()}
        </>
      )
    }

    // ==================== 混合模式渲染函数 ====================

    /** 渲染混合模式头部（Logo + Name） */
    function renderMixedHeader() {
      return (
        <div class="fd-vertical-menu__header">
          <div class="fd-vertical-menu__header__inner">
            {renderLogo()}
            {isCollapsed.value ? null : renderName()}
          </div>
        </div>
      )
    }

    /** 渲染混合模式菜单（显示二级菜单） */
    function renderMixedMenu() {
      if (!hasSubMenus.value) return null
      return (
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
            {currentSubMenus.value.map((menu: Menu) => renderMenuItem(menu, menuStore.activeFirstLevelPath))}
          </ElMenu>
        </ElScrollbar>
      )
    }

    /** 渲染混合模式布局（包含 header） */
    function renderMixedLayout() {
      return (
        <>
          {renderMixedHeader()}
          {renderMixedMenu()}
        </>
      )
    }

    // ==================== 双列模式渲染函数 ====================

    /** 渲染双列左侧头部（仅 Logo） */
    function renderDualLeftHeader() {
      return (
        <div class="fd-vertical-menu__left__header">
          {renderLogo()}
        </div>
      )
    }

    /** 渲染双列左侧菜单列表 */
    function renderDualLeftMenu() {
      return (
        <ElScrollbar>
          <div class="fd-vertical-menu__left__menu">
            {firstLevelMenus.value.map(menu => renderDualLeftItem(menu))}
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
        <div class="fd-vertical-menu__right__header">
          {renderName()}
        </div>
      )
    }

    /** 渲染右侧菜单项（双列模式） */
    function renderDualRightItem(menu: Menu, basePath: string) {
      const fullPath = getFullPath(menu.path, basePath)

      // 没有子菜单，渲染为叶子菜单项
      if (!menu.children || menu.children.length === 0) {
        return (
          <ElMenuItem key={menu.path} index={fullPath}>
            {renderIcon(menu.icon)}
            {renderTitle(menu.title)}
          </ElMenuItem>
        )
      }

      // 有子菜单，渲染为可展开的子菜单
      return (
        <ElSubMenu key={menu.path} index={fullPath} class="fd-vertical-menu__right__submenu">
          {{
            title: () => (
              <>
                {renderIcon(menu.icon)}
                {renderTitle(menu.title)}
              </>
            ),
            default: () => menu.children?.map((child: Menu) => renderDualRightItem(child, fullPath)),
          }}
        </ElSubMenu>
      )
    }

    /** 渲染双列右侧菜单（含滚动容器） */
    function renderDualRightMenu() {
      if (!hasSubMenus.value) return null
      return (
        <ElScrollbar class="fd-vertical-menu__right__scroll">
          <ElMenu
            class="fd-vertical-menu__right__menu"
            defaultActive={activeMenuPath.value}
            collapseTransition={false}
            uniqueOpened={isAccordionMode.value}
            backgroundColor="transparent"
            onSelect={handleSubMenuSelect}
          >
            {currentSubMenus.value.map(menu => renderDualRightItem(menu, activeFirstLevelPath.value))}
          </ElMenu>
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
          modalClass="fd-vertical-menu__drawer-modal"
          class="fd-vertical-menu__drawer"
          onClose={handleClose}
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
