/**
 * Vue Router 类型扩展
 * 扩展 RouteMeta 添加自定义字段
 */
import "vue-router"

declare module "vue-router" {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 菜单图标（Element Plus 图标名称） */
    icon?: string
    /** 是否在菜单中隐藏 */
    hidden?: boolean
    /** 是否固定在标签页（不可关闭） */
    affix?: boolean
    /** 是否缓存页面（keep-alive） */
    keepAlive?: boolean
    /** 所需权限列表 */
    permissions?: string[]
    /** 所需角色列表 */
    roles?: string[]
    /** 外链地址（点击后新窗口打开） */
    link?: string
    /** iframe 内嵌地址 */
    frameSrc?: string
    /** 是否全屏显示（不显示侧边栏和顶栏） */
    fullScreen?: boolean
    /** 激活的菜单路径（用于详情页高亮对应的列表菜单） */
    activeMenu?: string
    /** 面包屑是否可点击 */
    breadcrumbLink?: boolean
  }
}

export {}
