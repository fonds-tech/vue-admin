import type { Menu } from "@/stores"
import type { PropType, CSSProperties } from "vue"
import { Icon } from "@/components/core/fd-icon"
import { useRoute, useRouter } from "vue-router"
import { useMenuStore, useSettingsStore } from "@/stores"
import { ref, watch, computed, defineComponent } from "vue"
import { ElMenu, ElSubMenu, ElTooltip, ElMenuItem, ElScrollbar } from "element-plus"
import "./index.scss"

// ==================== 类型定义 ====================

/** 组件 Props 类型 */
interface FdMixedMenuProps {
  /** 是否折叠右侧菜单 */
  collapsed: boolean
  /** 是否显示一级菜单文字 */
  showFirstLevelText: boolean
  /** 自定义背景色 */
  backgroundColor?: string
  /** 一级菜单背景色 */
  firstLevelBgColor?: string
  /** 自定义文字颜色 */
  textColor?: string
  /** 激活状态文字颜色 */
  activeTextColor?: string
}

// ==================== 常量配置 ====================

/** 默认菜单配置 */
const MENU_CONFIG = {
  /** 默认背景色 */
  DEFAULT_BG_COLOR: "#ffffff",
  /** 一级菜单默认背景色 */
  FIRST_LEVEL_BG_COLOR: "#1e293b",
  /** 默认文字颜色 */
  DEFAULT_TEXT_COLOR: "#475569",
  /** 默认激活文字颜色 */
  DEFAULT_ACTIVE_COLOR: "#6366f1",
  /** 一级菜单图标大小 */
  FIRST_LEVEL_ICON_SIZE: 20,
  /** 二级菜单图标大小 */
  SUB_MENU_ICON_SIZE: 18,
  /** 一级菜单宽度（仅图标） */
  FIRST_LEVEL_WIDTH_ICON: 64,
  /** 一级菜单宽度（图标+文字） */
  FIRST_LEVEL_WIDTH_TEXT: 80,
} as const

// ==================== 组件定义 ====================

export default defineComponent({
  name: "FdMixedMenu",

  props: {
    /** 是否折叠右侧菜单 */
    collapsed: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    /** 是否显示一级菜单文字 */
    showFirstLevelText: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    /** 自定义背景色 */
    backgroundColor: {
      type: String as PropType<string>,
      default: MENU_CONFIG.DEFAULT_BG_COLOR,
    },
    /** 一级菜单背景色 */
    firstLevelBgColor: {
      type: String as PropType<string>,
      default: MENU_CONFIG.FIRST_LEVEL_BG_COLOR,
    },
    /** 自定义文字颜色 */
    textColor: {
      type: String as PropType<string>,
      default: MENU_CONFIG.DEFAULT_TEXT_COLOR,
    },
    /** 激活状态文字颜色 */
    activeTextColor: {
      type: String as PropType<string>,
      default: MENU_CONFIG.DEFAULT_ACTIVE_COLOR,
    },
  },

  emits: ["toggle-collapse", "menu-select"],

  setup(props: FdMixedMenuProps, { emit }) {
    // ==================== 依赖注入 ====================

    const route = useRoute()
    const router = useRouter()
    const menuStore = useMenuStore()
    const settingsStore = useSettingsStore()

    // ==================== 响应式状态 ====================

    /** 当前选中的一级菜单路径 */
    const activeFirstLevelPath = ref<string>("")

    // ==================== 计算属性 ====================

    /**
     * 一级菜单列表
     * 从 menuStore 获取顶级菜单（过滤隐藏项）
     */
    const firstLevelMenus = computed<Menu[]>(() => menuStore.menus)

    /**
     * 当前一级菜单对应的子菜单
     */
    const currentSubMenus = computed<Menu[]>(() => {
      if (!activeFirstLevelPath.value) return []
      const currentMenu = firstLevelMenus.value.find(menu => menu.path === activeFirstLevelPath.value)
      return currentMenu?.children || []
    })

    /**
     * 是否有子菜单可显示
     */
    const hasSubMenus = computed<boolean>(() => currentSubMenus.value.length > 0)

    /**
     * 菜单是否使用手风琴模式
     */
    const isAccordionMode = computed<boolean>(() => settingsStore.menuMode === "accordion")

    /**
     * 当前激活的菜单路径（用于二级菜单高亮）
     */
    const activeMenuPath = computed<string>(() => {
      if (route.meta.activeMenu) {
        return route.meta.activeMenu as string
      }
      return route.path
    })

    /**
     * 一级菜单容器宽度
     */
    const firstLevelWidth = computed<number>(() => {
      return props.showFirstLevelText ? MENU_CONFIG.FIRST_LEVEL_WIDTH_TEXT : MENU_CONFIG.FIRST_LEVEL_WIDTH_ICON
    })

    /**
     * 一级菜单容器样式
     */
    const firstLevelStyle = computed<CSSProperties>(() => ({
      width: `${firstLevelWidth.value}px`,
      backgroundColor: props.firstLevelBgColor,
    }))

    /**
     * 一级菜单项高度
     */
    const firstLevelItemHeight = computed<string>(() => {
      return props.showFirstLevelText ? "60px" : "48px"
    })

    // ==================== 工具函数 ====================

    /**
     * 判断是否为外链
     */
    const isExternalLink = (path: string): boolean => {
      return /^https?:\/\//.test(path)
    }

    /**
     * 计算完整路径
     */
    const getFullPath = (path: string, basePath: string): string => {
      if (isExternalLink(path)) return path
      if (path.startsWith("/")) return path
      return basePath ? `${basePath}/${path}`.replace(/\/+/g, "/") : `/${path}`
    }

    /**
     * 判断一级菜单是否激活
     */
    const isFirstLevelActive = (menu: Menu): boolean => {
      // 无子菜单时，直接比较路径
      if (!menu.children?.length) {
        return menu.path === route.path
      }
      // 有子菜单时，比较一级路径
      return menu.path === activeFirstLevelPath.value
    }

    /**
     * 判断菜单是否只有单个可提升的子项
     */
    const isSinglePromotableChild = (menu: Menu): boolean => {
      if (!menu.children || menu.children.length !== 1) return false
      return !menu.children[0]?.children?.length
    }

    // ==================== 初始化 ====================

    /**
     * 根据当前路由初始化一级菜单选中状态
     */
    const initActiveFirstLevel = (): void => {
      const currentPath = route.path
      // 查找匹配的一级菜单
      const matchedMenu = firstLevelMenus.value.find((menu) => {
        if (menu.path === currentPath) return true
        if (currentPath.startsWith(`${menu.path}/`)) return true
        return false
      })
      if (matchedMenu) {
        activeFirstLevelPath.value = matchedMenu.path
      }
      else if (firstLevelMenus.value.length > 0) {
        // 默认选中第一个
        activeFirstLevelPath.value = firstLevelMenus.value[0]?.path || ""
      }
    }

    // 监听路由变化，更新一级菜单激活状态
    watch(
      () => route.path,
      () => initActiveFirstLevel(),
      { immediate: true },
    )

    // ==================== 事件处理 ====================

    /**
     * 一级菜单点击处理
     */
    const handleFirstLevelClick = (menu: Menu): void => {
      // 无子菜单时直接跳转
      if (!menu.children?.length) {
        handleNavigate(menu.path)
        return
      }
      // 有子菜单时更新选中状态
      activeFirstLevelPath.value = menu.path
      emit("menu-select", menu.path)
    }

    /**
     * 二级菜单选择处理
     */
    const handleSubMenuSelect = (path: string): void => {
      handleNavigate(path)
      emit("menu-select", path)
    }

    /**
     * 路由导航
     */
    const handleNavigate = (path: string): void => {
      if (isExternalLink(path)) {
        window.open(path, "_blank", "noopener,noreferrer")
        return
      }
      router.push(path)
    }

    /**
     * 切换折叠状态
     */
    const handleToggleCollapse = (): void => {
      emit("toggle-collapse")
    }

    // ==================== 渲染函数 ====================

    /**
     * 渲染菜单图标
     */
    const renderIcon = (icon?: string, size: number = MENU_CONFIG.SUB_MENU_ICON_SIZE) => {
      if (!icon) return null
      return <Icon icon={icon} size={size} />
    }

    /**
     * 渲染一级菜单项
     */
    const renderFirstLevelItem = (menu: Menu) => {
      const isActive = isFirstLevelActive(menu)

      const itemContent = (
        <div class={["fd-mixed-menu__first-item", { "is-active": isActive }]} style={{ height: firstLevelItemHeight.value }} onClick={() => handleFirstLevelClick(menu)}>
          {renderIcon(menu.icon, MENU_CONFIG.FIRST_LEVEL_ICON_SIZE)}
          {props.showFirstLevelText && <span class="fd-mixed-menu__first-text">{menu.title}</span>}
        </div>
      )

      // 不显示文字时，添加 Tooltip
      if (!props.showFirstLevelText) {
        return (
          <ElTooltip key={menu.path} content={menu.title} placement="right" offset={15} hideAfter={0}>
            {itemContent}
          </ElTooltip>
        )
      }

      return <div key={menu.path}>{itemContent}</div>
    }

    /**
     * 渲染叶子菜单项
     */
    const renderLeafMenuItem = (menu: Menu, fullPath: string) => {
      return (
        <ElMenuItem key={menu.path} index={fullPath} class="fd-mixed-menu__sub-item">
          {renderIcon(menu.icon)}
          <span>{menu.title}</span>
        </ElMenuItem>
      )
    }

    /**
     * 渲染子菜单
     */
    const renderSubMenu = (menu: Menu, fullPath: string) => {
      return (
        <ElSubMenu key={menu.path} index={fullPath} class="fd-mixed-menu__submenu">
          {{
            title: () => (
              <>
                {renderIcon(menu.icon)}
                <span>{menu.title}</span>
              </>
            ),
            default: () => menu.children?.map(child => renderSubMenuItem(child, fullPath)),
          }}
        </ElSubMenu>
      )
    }

    /**
     * 递归渲染二级菜单项
     */
    const renderSubMenuItem = (menu: Menu, basePath: string) => {
      const fullPath = getFullPath(menu.path, basePath)

      if (!menu.children || menu.children.length === 0) {
        return renderLeafMenuItem(menu, fullPath)
      }

      if (isSinglePromotableChild(menu)) {
        const firstChild = menu.children[0]!
        const childFullPath = getFullPath(firstChild.path, fullPath)
        return (
          <ElMenuItem key={childFullPath} index={childFullPath} class="fd-mixed-menu__sub-item">
            {renderIcon(firstChild.icon || menu.icon)}
            <span>{firstChild.title || menu.title}</span>
          </ElMenuItem>
        )
      }

      return renderSubMenu(menu, fullPath)
    }

    /**
     * 渲染一级菜单列表
     */
    const renderFirstLevelMenu = () => (
      <div class="fd-mixed-menu__first" style={firstLevelStyle.value}>
        <ElScrollbar class="fd-mixed-menu__first-scroll">{firstLevelMenus.value.map(menu => renderFirstLevelItem(menu))}</ElScrollbar>
      </div>
    )

    /**
     * 渲染二级菜单列表
     */
    const renderSubMenuList = () => {
      if (!hasSubMenus.value) return null

      return (
        <div class={["fd-mixed-menu__second", { "is-collapsed": props.collapsed }]} style={{ backgroundColor: props.backgroundColor }}>
          <ElScrollbar class="fd-mixed-menu__second-scroll">
            <ElMenu
              class="fd-mixed-menu__menu"
              defaultActive={activeMenuPath.value}
              collapse={props.collapsed}
              collapseTransition={false}
              uniqueOpened={isAccordionMode.value}
              backgroundColor="transparent"
              textColor={props.textColor}
              activeTextColor={props.activeTextColor}
              onSelect={handleSubMenuSelect}
            >
              {currentSubMenus.value.map(menu => renderSubMenuItem(menu, activeFirstLevelPath.value))}
            </ElMenu>
          </ElScrollbar>

          {/* 折叠切换按钮 */}
          <div class="fd-mixed-menu__collapse-btn" onClick={handleToggleCollapse}>
            <Icon icon={props.collapsed ? "ri:arrow-right-s-line" : "ri:arrow-left-s-line"} size={18} />
          </div>
        </div>
      )
    }

    // ==================== 组件渲染 ====================

    return () => (
      <div class="fd-mixed-menu">
        {renderFirstLevelMenu()}
        {renderSubMenuList()}
      </div>
    )
  },
})
