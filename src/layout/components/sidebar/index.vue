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
import SidebarLogo from "../logo/index.vue"
import SidebarMenu from "../menu/index.tsx"
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
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  box-shadow: 2px 0 8px rgb(0 0 0 / 4%);
  transition: width $transition-duration $transition-timing;
  border-right: 1px solid #e2e8f0;
  flex-direction: column;
}
</style>
