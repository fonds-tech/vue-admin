<template>
  <aside class="sidebar" :style="sidebarStyle">
    <!-- Logo -->
    <div class="sidebar-logo">
      <img src="@/assets/logo.svg" alt="logo" class="logo-img" />
      <h1 v-show="!appStore.sidebarCollapsed" class="logo-title">Vue Admin</h1>
    </div>

    <!-- 菜单 -->
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
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
            v-else-if="menu.children.length === 1 && !menu.children[0].children?.length"
            :index="`${menu.path}/${menu.children[0].path}`"
          >
            <el-icon v-if="menu.children[0].meta?.icon || menu.meta?.icon">
              <component :is="menu.children[0].meta?.icon || menu.meta?.icon" />
            </el-icon>
            <template #title>{{ menu.children[0].meta?.title || menu.meta?.title }}</template>
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
  </aside>
</template>

<script setup lang="ts">
/**
 * 侧边栏组件
 */
import { computed } from "vue"
import { useAppStore } from "@/stores/app"
import { useMenuStore } from "@/stores/menu"
import { useRoute, useRouter } from "vue-router"
import SidebarMenuItem from "./SidebarMenuItem.vue"

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const menuStore = useMenuStore()

// 从 menuStore 获取可见菜单列表
const menuList = computed(() => menuStore.visibleMenus)

const activeMenu = computed(() => {
  // 如果设置了 activeMenu，使用它（用于详情页高亮列表菜单）
  if (route.meta.activeMenu) {
    return route.meta.activeMenu as string
  }
  return route.path
})

const sidebarStyle = computed(() => ({
  width: `${appStore.sidebarWidth}px`,
}))

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
.sidebar {
  top: 0;
  left: 0;
  height: 100vh;
  display: flex;
  z-index: $z-index-fixed;
  overflow: hidden;
  position: fixed;
  background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%);
  transition: width $transition-duration $transition-timing;
  flex-direction: column;

  &-logo {
    height: $header-height;
    display: flex;
    padding: 0 $spacing-base;
    align-items: center;
    justify-content: center;

    .logo-img {
      width: 32px;
      height: 32px;
    }

    .logo-title {
      color: #fff;
      overflow: hidden;
      font-size: 18px;
      font-weight: 600;
      margin-left: $spacing-sm;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

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

