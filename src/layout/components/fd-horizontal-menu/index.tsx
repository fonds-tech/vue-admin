import type { Menu } from "@/stores"
import FdIcon from "@/components/core/fd-icon"
import { useRoute, useRouter } from "vue-router"
import { ElMenu, ElSubMenu, ElMenuItem } from "element-plus"
import { useMenuStore, useSettingsStore } from "@/stores"
import { ref, watch, computed, nextTick, onMounted, onUnmounted, defineComponent } from "vue"
import "./index.scss"

export default defineComponent({
  name: "fd-horizontal-menu",
  setup() {
    const route = useRoute()
    const router = useRouter()

    const menuStore = useMenuStore()
    const settingsStore = useSettingsStore()

    // ==================== 响应式状态 ====================

    /** 菜单容器引用 */
    const menuContainerRef = ref<HTMLElement | null>(null)

    /** 可见菜单数量 */
    const visibleCount = ref<number>(Infinity)

    // ==================== 计算属性 ====================

    /** 是否为水平布局模式 */
    const isHorizontalLayout = computed<boolean>(() => settingsStore.isHorizontalLayout)

    /** 是否为混合布局模式 */
    const isMixedLayout = computed<boolean>(() => settingsStore.isMixedLayout)

    /** 是否显示水平菜单（水平或混合布局模式下显示） */
    const show = computed<boolean>(() => isHorizontalLayout.value || isMixedLayout.value)

    /** 可见菜单列表 */
    const menuList = computed<Menu[]>(() => menuStore.menus)

    /** 菜单是否使用手风琴模式 */
    const isAccordionMode = computed<boolean>(() => settingsStore.menuMode === "accordion")

    /** 当前激活的菜单路径 */
    const activeMenuPath = computed<string>(() => {
      // 混合模式下使用一级菜单路径
      if (isMixedLayout.value) {
        return menuStore.activeFirstLevelPath
      }
      if (route.meta.activeMenu) {
        return route.meta.activeMenu as string
      }
      return route.path
    })

    /** 可见的菜单项 */
    const visibleMenus = computed<Menu[]>(() => {
      if (visibleCount.value >= menuList.value.length) {
        return menuList.value
      }
      return menuList.value.slice(0, visibleCount.value)
    })

    /** 溢出的菜单项（放入"更多"下拉菜单） */
    const overflowMenus = computed<Menu[]>(() => {
      if (visibleCount.value >= menuList.value.length) {
        return []
      }
      return menuList.value.slice(visibleCount.value)
    })

    /** 是否有溢出菜单 */
    const hasOverflow = computed<boolean>(() => overflowMenus.value.length > 0)

    // ==================== 溢出计算 ====================

    /** 计算可见菜单数量 */
    function calculateVisibleCount() {
      if (!menuContainerRef.value) return

      const container = menuContainerRef.value
      const containerWidth = container.clientWidth
      const menuItems = container.querySelectorAll<HTMLElement>(".fd-horizontal-menu__menu-item")

      if (menuItems.length === 0) return

      // 预留"更多"按钮的宽度
      const moreButtonWidth = 60
      let totalWidth = 0
      let count = 0

      for (const item of menuItems) {
        const itemWidth = item.offsetWidth + 8 // 加上 gap
        if (totalWidth + itemWidth + moreButtonWidth <= containerWidth) {
          totalWidth += itemWidth
          count++
        } else {
          break
        }
      }

      // 如果所有菜单都能放下，则不需要"更多"按钮
      if (count === menuList.value.length) {
        visibleCount.value = Infinity
      } else {
        // 至少显示一个菜单项
        visibleCount.value = Math.max(1, count)
      }
    }

    /** 防抖的计算函数 */
    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    function debouncedCalculate() {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        // 先重置为显示所有，让 DOM 更新
        visibleCount.value = Infinity
        nextTick(() => {
          calculateVisibleCount()
        })
      }, 100)
    }

    // ==================== 生命周期 ====================

    let resizeObserver: ResizeObserver | null = null

    onMounted(() => {
      nextTick(() => {
        if (menuContainerRef.value) {
          resizeObserver = new ResizeObserver(debouncedCalculate)
          resizeObserver.observe(menuContainerRef.value)
          calculateVisibleCount()
        }
      })
    })

    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      if (resizeTimer) {
        clearTimeout(resizeTimer)
      }
    })

    // 监听菜单列表变化
    watch(menuList, () => {
      nextTick(debouncedCalculate)
    })

    // 混合模式下监听路由变化，更新一级菜单选中状态
    watch(
      () => route.path,
      (path) => {
        if (isMixedLayout.value) {
          menuStore.initActiveFirstLevel(path)
        }
      },
      { immediate: true },
    )

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

    /**
     * 递归查找菜单下第一个可跳转的页面路径
     */
    function findFirstChildPath(menu: Menu): string | undefined {
      // 如果没有子菜单，返回当前路径
      if (!menu.children || menu.children.length === 0) {
        return menu.path
      }
      // 递归查找第一个子菜单
      for (const child of menu.children) {
        const result = findFirstChildPath(child)
        if (result) return result
      }
      return undefined
    }

    // ==================== 事件处理 ====================

    /** 菜单选择处理 */
    function handleMenuSelect(path: string): void {
      if (isExternalLink(path)) {
        window.open(path, "_blank", "noopener,noreferrer")
        return
      }

      // 混合模式下，点击一级菜单时更新 store 并跳转到第一个子页面
      if (isMixedLayout.value) {
        const menu = menuList.value.find(m => m.path === path)
        if (menu) {
          menuStore.setActiveFirstLevelPath(path)
          const targetPath = findFirstChildPath(menu)
          if (targetPath && targetPath !== route.path) {
            router.push(targetPath)
          }
          return
        }
      }

      router.push(path)
    }

    // ==================== 渲染函数 ====================

    /** 渲染菜单图标 */
    function renderIcon(icon?: string, size: number = 18) {
      if (!icon) return null
      return <FdIcon icon={icon} size={size} class="fd-horizontal-menu__icon" />
    }

    /** 渲染菜单标题 */
    function renderTitle(title?: string) {
      return <span class="fd-horizontal-menu__title">{title}</span>
    }

    /** 渲染一级菜单项（混合模式下不展开子菜单） */
    function renderFirstLevelMenuItem(menu: Menu, isOverflow: boolean = false) {
      return (
        <ElMenuItem
          key={menu.path}
          index={menu.path}
          class={["fd-horizontal-menu__item", { "fd-horizontal-menu__menu-item": !isOverflow }]}
        >
          {renderIcon(menu.icon)}
          {renderTitle(menu.title)}
        </ElMenuItem>
      )
    }

    /** 渲染叶子菜单项（无子菜单） */
    function renderLeafMenuItem(menu: Menu, fullPath: string, isOverflow: boolean = false) {
      return (
        <ElMenuItem
          key={menu.path}
          index={fullPath}
          class={["fd-horizontal-menu__item", { "fd-horizontal-menu__menu-item": !isOverflow }]}
        >
          {renderIcon(menu.icon)}
          {renderTitle(menu.title)}
        </ElMenuItem>
      )
    }

    /** 渲染子菜单（有子菜单项） */
    function renderSubMenu(menu: Menu, fullPath: string, isOverflow: boolean = false) {
      const children = menu.children || []
      return (
        <ElSubMenu
          key={menu.path}
          index={fullPath}
          class={["fd-horizontal-menu__submenu", { "fd-horizontal-menu__menu-item": !isOverflow }]}
          popperClass="fd-horizontal-menu__popper"
        >
          {{
            title: () => [renderIcon(menu.icon), renderTitle(menu.title)],
            default: () => children.map((child: Menu) => renderMenuItem(child, fullPath, true)),
          }}
        </ElSubMenu>
      )
    }

    /** 递归渲染菜单项 */
    function renderMenuItem(menu: Menu, basePath: string, isOverflow: boolean = false) {
      const fullPath = getFullPath(menu.path, basePath)

      // 没有子菜单，渲染为叶子菜单项
      if (!menu.children || menu.children.length === 0) {
        return renderLeafMenuItem(menu, fullPath, isOverflow)
      }

      // 有子菜单，渲染为可展开的子菜单
      return renderSubMenu(menu, fullPath, isOverflow)
    }

    /** 渲染菜单项（根据模式选择渲染方式） */
    function renderMenuItemByMode(menu: Menu, isOverflow: boolean = false) {
      // 混合模式下只渲染一级菜单
      if (isMixedLayout.value) {
        return renderFirstLevelMenuItem(menu, isOverflow)
      }
      // 水平模式下递归渲染
      return renderMenuItem(menu, "", isOverflow)
    }

    /** 渲染"更多"按钮 */
    function renderMoreButton() {
      if (!hasOverflow.value) return null

      return (
        <ElSubMenu
          index="__more__"
          class="fd-horizontal-menu__more"
          popperClass="fd-horizontal-menu__popper"
        >
          {{
            title: () => <FdIcon icon="ri:more-fill" size={20} />,
            default: () => overflowMenus.value.map(menu => renderMenuItemByMode(menu, true)),
          }}
        </ElSubMenu>
      )
    }

    /** 渲染水平菜单 */
    function renderHorizontalMenu() {
      return (
        <div class="fd-horizontal-menu" ref={menuContainerRef}>
          <ElMenu
            class="fd-horizontal-menu__container"
            mode="horizontal"
            ellipsis={false}
            hideTimeout={50}
            showTimeout={50}
            defaultActive={activeMenuPath.value}
            uniqueOpened={isAccordionMode.value}
            backgroundColor="transparent"
            popperClass="fd-horizontal-menu__popper"
            onSelect={handleMenuSelect}
          >
            {visibleMenus.value.map(menu => renderMenuItemByMode(menu, false))}
            {renderMoreButton()}
          </ElMenu>
        </div>
      )
    }

    // ==================== 主渲染 ====================

    return () => (show.value ? renderHorizontalMenu() : null)
  },
})
