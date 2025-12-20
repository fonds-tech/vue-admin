<template>
  <el-breadcrumb v-if="show" class="fd-breadcrumb" :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
      <span v-if="index < breadcrumbs.length - 1" class="fd-breadcrumb__link" @click="handleClick(item)">
        {{ item.title }}
      </span>
      <span v-else class="fd-breadcrumb__current">
        {{ item.title }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from "./types"
import { computed } from "vue"
import { ArrowRight } from "@element-plus/icons-vue"
import { useRoute, useRouter } from "vue-router"
import { useMenuStore, useDeviceStore, useSettingsStore } from "@/stores"

defineOptions({ name: "fd-breadcrumb" })

/** 首页路径 */
const HOME_PATH = "/dashboard"
/** 首页标题 */
const HOME_TITLE = "首页"
/** 首页面包屑项 */
const HOME_ITEM: BreadcrumbItem = { path: HOME_PATH, title: HOME_TITLE }

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()
const deviceStore = useDeviceStore()
const settingsStore = useSettingsStore()

const show = computed(() => !deviceStore.isMobile && !settingsStore.isHorizontalLayout && !settingsStore.isMixedLayout)

/**
 * 计算面包屑数据
 * 从菜单 store 中通过 parentId 递归构建完整的菜单层级
 */
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  // 菜单未初始化时，只显示首页
  if (!menuStore.initialized) return [HOME_ITEM]

  // 优先使用路由名称查找菜单（避免动态路由参数匹配失败）
  const routeName = route.name as string
  const currentMenu = routeName ? menuStore.list.find((m) => m.name === routeName) : menuStore.findMenu(route.path)

  // 如果找不到菜单，只显示首页
  if (!currentMenu) return [HOME_ITEM]

  // 从当前菜单向上递归查找所有父级
  const items = getMenuChain(currentMenu.id)

  // 如果第一项不是首页，在开头添加首页
  if (items.length > 0 && items[0]?.path !== HOME_PATH) {
    items.unshift(HOME_ITEM)
  }

  // 如果没有任何项，至少显示首页
  return items.length > 0 ? items : [HOME_ITEM]
})

/**
 * 根据菜单 ID 递归向上查找所有父级菜单
 * @param menuId 当前菜单 ID
 * @param result 结果数组（从子到父累积）
 */
function getMenuChain(menuId: number, result: BreadcrumbItem[] = []): BreadcrumbItem[] {
  const menu = menuStore.list.find((m) => m.id === menuId)
  if (!menu) return result

  // 添加当前菜单到结果（只添加非隐藏且有标题的）
  if (!menu.hidden && menu.title) {
    result.unshift({ path: menu.path, title: menu.title })
  }

  // 如果有父级，继续向上查找
  if (menu.parentId && menu.parentId !== 0) {
    return getMenuChain(menu.parentId, result)
  }

  return result
}

/**
 * 递归查找目录下第一个可跳转的子菜单路径
 * @param parentId 父级菜单 ID
 */
function findFirstChildMenuPath(parentId: number): string | undefined {
  const children = menuStore.list
    .filter((m) => m.parentId === parentId && !m.hidden && m.status === 1)
    .sort((a, b) => a.sort - b.sort)

  for (const child of children) {
    // 页面类型（type=1），直接返回路径
    if (child.type === 1) return child.path
    // 目录类型（type=0），递归查找
    if (child.type === 0) {
      const result = findFirstChildMenuPath(child.id)
      if (result) return result
    }
  }

  return undefined
}

/**
 * 根据路径查找菜单（支持精确匹配和名称匹配）
 * @param path 路由路径
 */
function findMenuByPath(path: string) {
  return menuStore.list.find((m) => m.path === path)
}

/**
 * 处理面包屑点击
 * - 目录类型：跳转到第一个可访问的子菜单
 * - 页面类型：直接跳转
 */
function handleClick(item: BreadcrumbItem) {
  if (!item.path || item.path === route.path) return

  // 查找点击项对应的菜单
  const menu = findMenuByPath(item.path)

  // 如果是目录类型，查找其第一个可访问的子菜单
  if (menu?.type === 0) {
    const firstChildPath = findFirstChildMenuPath(menu.id)
    if (firstChildPath) {
      router.push(firstChildPath)
      return
    }
  }

  // 否则直接跳转
  router.push(item.path)
}
</script>

<style lang="scss" scoped>
.fd-breadcrumb {
  display: flex;
  align-items: center;

  // 面包屑项容器
  :deep(.el-breadcrumb__inner) {
    display: flex;
    align-items: center;
  }

  // 可点击的链接
  &__link {
    color: var(--el-text-color-regular);
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  // 当前页面（不可点击）
  &__current {
    color: var(--el-text-color-primary);
    font-weight: 500;
  }
}
</style>
