<template>
  <el-scrollbar class="sidebar-menu">
    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      :collapse-transition="false"
      :unique-opened="true"
      background-color="transparent"
      text-color="#e5e7eb"
      active-text-color="#818cf8"
      @select="handleMenuSelect"
    >
      <!-- 递归渲染菜单项 -->
      <template v-for="menu in menuList" :key="menu.path">
        <!-- 无子菜单或只有一个子菜单的情况 -->
        <el-menu-item
          v-if="!menu.children || menu.children.length === 0"
          :index="menu.path"
        >
          <el-icon v-if="menu.meta?.icon">
            <component :is="menu.meta.icon" />
          </el-icon>
          <template #title>{{ menu.meta?.title }}</template>
        </el-menu-item>

        <!-- 单个子菜单（不展示父级，直接展示子菜单） -->
        <el-menu-item
          v-else-if="menu.children && menu.children.length === 1 && !menu.children[0]?.children?.length"
          :index="`${menu.path}/${menu.children[0]?.path}`"
        >
          <el-icon v-if="menu.children[0]?.meta?.icon || menu.meta?.icon">
            <component :is="menu.children[0]?.meta?.icon || menu.meta?.icon" />
          </el-icon>
          <template #title>{{ menu.children[0]?.meta?.title || menu.meta?.title }}</template>
        </el-menu-item>

        <!-- 多个子菜单 -->
        <el-sub-menu v-else :index="menu.path">
          <template #title>
            <el-icon v-if="menu.meta?.icon">
              <component :is="menu.meta.icon" />
            </el-icon>
            <span>{{ menu.meta?.title }}</span>
          </template>
          <!-- 递归渲染子菜单 -->
          <sidebar-menu-item
            v-for="child in menu.children"
            :key="child.path"
            :menu="child"
            :base-path="menu.path"
          />
        </el-sub-menu>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
/**
 * 侧边栏菜单组件
 */
import SidebarMenuItem from "./MenuItem.vue"
import { computed } from "vue"
import { useMenuStore } from "@/stores/menu"
import { useRoute, useRouter } from "vue-router"

defineProps<{
  /** 是否折叠 */
  collapsed?: boolean
}>()

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()

/** 从 menuStore 获取可见菜单列表 */
const menuList = computed(() => menuStore.visibleMenus)

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
</script>

<style lang="scss" scoped>
.sidebar-menu {
  flex: 1;
  overflow: hidden;

  :deep(.el-menu) {
    border-right: none;
  }

  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    margin: 4px 8px;
    border-radius: $border-radius;

    &:hover {
      background-color: rgb(255 255 255 / 10%) !important;
    }

    &.is-active {
      color: #fff !important;
      background: linear-gradient(90deg, $primary-color 0%, $primary-light 100%);
    }
  }
}
</style>
