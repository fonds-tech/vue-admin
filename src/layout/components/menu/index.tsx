import type { BackendMenu } from "@/stores/permission/interface"
import Icon from "@/components/Icon/index.vue"
import { useAppStore } from "@/stores/app"
import { useMenuStore } from "@/stores/menu"
import { useRoute, useRouter } from "vue-router"
import { computed, defineComponent } from "vue"
import { ElMenu, ElSubMenu, ElMenuItem, ElScrollbar } from "element-plus"
import "./index.scss"

export default defineComponent({
  name: "menu",
  props: {
    /** 是否折叠 */
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const menuStore = useMenuStore()
    const appStore = useAppStore()

    /** 从 menuStore 获取可见菜单列表 */
    const menuList = computed(() => menuStore.visibleMenus)

    /** 菜单是否使用手风琴模式（同时只展开一个子菜单） */
    const menuUniqueOpened = computed(() => appStore.menuMode === "accordion")

    /** 当前激活的菜单 */
    const activeMenu = computed(() => {
      // 如果设置了 activeMenu，使用它（用于详情页高亮列表菜单）
      if (route.meta.activeMenu) {
        return route.meta.activeMenu as string
      }
      return route.path
    })

    /** 菜单选择处理 */
    function handleMenuSelect(path: string) {
      // 外链处理
      if (path.startsWith("http")) {
        window.open(path, "_blank")
        return
      }
      router.push(path)
    }

    /**
     * 计算完整路径
     * @param path 当前路径
     * @param basePath 父级路径
     */
    function getFullPath(path: string, basePath: string): string {
      // 如果是外链，直接返回
      if (path.startsWith("http")) {
        return path
      }
      // 拼接父级路径
      return basePath ? `${basePath}/${path}` : path
    }

    /**
     * 渲染菜单图标
     * @param icon 图标名称
     */
    function renderIcon(icon?: string) {
      if (!icon) return null
      return <Icon icon={icon} size={18} />
    }

    /**
     * 递归渲染菜单项
     * @param menu 菜单数据
     * @param basePath 父级路径
     */
    function renderMenuItem(menu: BackendMenu, basePath: string) {
      const fullPath = getFullPath(menu.path, basePath)

      // 无子菜单
      if (!menu.children || menu.children.length === 0) {
        return (
          <ElMenuItem key={menu.path} index={fullPath}>
            {renderIcon(menu.meta?.icon)}
            <span>{menu.meta?.title}</span>
          </ElMenuItem>
        )
      }

      // 单个子菜单（不展示父级，直接展示子菜单）
      const firstChild = menu.children[0]
      if (menu.children.length === 1 && firstChild && !firstChild.children?.length) {
        const childFullPath = getFullPath(firstChild.path, fullPath)
        return (
          <ElMenuItem key={childFullPath} index={childFullPath}>
            {renderIcon(firstChild.meta?.icon || menu.meta?.icon)}
            <span>{firstChild.meta?.title || menu.meta?.title}</span>
          </ElMenuItem>
        )
      }

      // 多个子菜单（递归渲染）
      return (
        <ElSubMenu key={menu.path} index={fullPath}>
          {{
            title: () => [renderIcon(menu.meta?.icon), <span>{menu.meta?.title}</span>],
            default: () => menu.children?.map(child => renderMenuItem(child, fullPath)),
          }}
        </ElSubMenu>
      )
    }

    return () => (
      <ElScrollbar class="menu">
        <ElMenu
          defaultActive={activeMenu.value}
          collapse={props.collapsed}
          collapseTransition={false}
          uniqueOpened={menuUniqueOpened.value}
          backgroundColor="transparent"
          textColor="#475569"
          activeTextColor="#6366f1"
          onSelect={handleMenuSelect}
        >
          {menuList.value.map(menu => renderMenuItem(menu, ""))}
        </ElMenu>
      </ElScrollbar>
    )
  },
})
