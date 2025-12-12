<template>
  <aside class="sidebar" :style="sidebarStyle">
    <!-- Logo -->
    <sidebar-logo :collapsed="appStore.sidebarCollapsed" />

    <!-- 菜单 -->
    <sidebar-menu :collapsed="appStore.sidebarCollapsed" />
  </aside>
</template>

<script setup lang="ts">
/**
 * 侧边栏容器组件
 * 组合 Logo 和 Menu 子组件
 */
import SidebarLogo from "./Logo.vue"
import SidebarMenu from "./Menu.vue"
import { computed } from "vue"
import { useAppStore } from "@/stores/app"

defineOptions({ name: "layout-sidebar" })

const appStore = useAppStore()

/** 侧边栏样式 */
const sidebarStyle = computed(() => ({
  width: `${appStore.sidebarWidth}px`,
}))
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
  background-color: #001529; // 平铺深色背景
  transition: width $transition-duration $transition-timing;
  flex-direction: column;
}
</style>
