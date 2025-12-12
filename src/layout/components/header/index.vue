<template>
  <header class="header">
    <div class="header-left">
      <!-- 折叠按钮 -->
      <header-collapse :collapsed="appStore.sidebarCollapsed" @toggle="toggleSidebar" />

      <!-- 面包屑 -->
      <header-breadcrumb />
    </div>

    <div class="header-right">
      <!-- 搜索 -->
      <header-search />

      <!-- 主题切换 -->
      <header-theme-switch />

      <!-- 语言切换 -->
      <header-lang-switch />

      <!-- 全屏 -->
      <header-fullscreen />

      <!-- 设置按钮 -->
      <el-tooltip content="设置">
        <el-icon class="header-action" @click="openSettings">
          <Setting />
        </el-icon>
      </el-tooltip>

      <!-- 用户信息 -->
      <header-user-dropdown @open-settings="openSettings" />
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * 顶栏容器组件
 * 组合所有 Header 子组件
 */
import HeaderSearch from "./Search.vue"
import HeaderCollapse from "./Collapse.vue"
import HeaderBreadcrumb from "./Breadcrumb.vue"
import HeaderFullscreen from "./Fullscreen.vue"
import HeaderLangSwitch from "./LangSwitch.vue"
import HeaderThemeSwitch from "./ThemeSwitch.vue"
import HeaderUserDropdown from "./UserDropdown.vue"
import { useAppStore } from "@/stores/app"

defineOptions({ name: "layout-header" })

const emit = defineEmits<{
  openSettings: []
}>()

const appStore = useAppStore()

/** 切换侧边栏 */
function toggleSidebar() {
  appStore.toggleSidebar()
}

/** 打开设置 */
function openSettings() {
  emit("openSettings")
}
</script>

<style lang="scss" scoped>
.header {
  top: 0;
  height: $header-height;
  display: flex;
  padding: 0 $spacing-base;
  z-index: $z-index-sticky;
  position: sticky;
  align-items: center;
  border-bottom: 1px solid $border-light;
  justify-content: space-between;
  background-color: $bg-white;

  &-left {
    gap: $spacing-base;
    display: flex;
    align-items: center;
  }

  &-right {
    gap: $spacing-sm;
    display: flex;
    align-items: center;
  }

  &-action {
    width: 36px;
    cursor: pointer;
    height: 36px;
    display: flex;
    font-size: 18px;
    transition: background-color $transition-duration;
    align-items: center;
    border-radius: $border-radius;
    justify-content: center;

    &:hover {
      background-color: $bg-color;
    }
  }
}
</style>
