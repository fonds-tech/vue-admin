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
        background-color="transparent"
        text-color="#e5e7eb"
        active-text-color="#818cf8"
        @select="handleMenuSelect"
      >
        <!-- 首页 -->
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <template #title>{{ $t("menu.dashboard") }}</template>
        </el-menu-item>

        <!-- 系统管理 -->
        <el-sub-menu v-for="menu in asyncRoutes.filter((r) => !r.meta?.hidden)" :key="menu.path" :index="menu.path">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>{{ menu.meta?.title }}</span>
          </template>
          <el-menu-item v-for="child in menu.children" :key="child.path" :index="`${menu.path}/${child.path}`">
            {{ child.meta?.title }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-scrollbar>
  </aside>
</template>

<script setup lang="ts">
/**
 * 侧边栏组件
 */
import { computed } from "vue"
import { asyncRoutes } from "@/router"
import { useAppStore } from "@/stores/app"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const activeMenu = computed(() => route.path)

const sidebarStyle = computed(() => ({
  width: `${appStore.sidebarWidth}px`,
}))

function handleMenuSelect(path: string) {
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
