<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <layout-sidebar />

    <!-- 主体区域 -->
    <div class="layout-main" :style="mainStyle">
      <!-- 顶栏 -->
      <layout-header :class="{ 'is-fixed': appStore.fixedHeader }" @open-settings="settingsVisible = true" />

      <!-- 进程标签栏 -->
      <layout-process v-if="appStore.showProcess" />

      <!-- 内容区 -->
      <layout-view />
    </div>

    <!-- 水印 -->
    <layout-watermark />

    <!-- 设置抽屉 -->
    <layout-settings v-model="settingsVisible" />
  </div>
</template>

<script setup lang="ts">
/**
 * 主布局组件
 * 组装侧边栏、顶栏、进程标签、视图出口、水印和设置抽屉
 */
import LayoutView from "./components/view/index.vue"
import LayoutHeader from "./components/header/index.vue"
import LayoutProcess from "./components/process/index.vue"
import LayoutSidebar from "./components/sidebar/index.vue"
import LayoutSettings from "./components/settings/index.vue"
import LayoutWatermark from "./components/watermark/index.vue"
import { useAppStore } from "@/stores"
import { ref, computed } from "vue"

const appStore = useAppStore()

/** 设置抽屉是否可见 */
const settingsVisible = ref(false)

/** 主体区域样式 */
const mainStyle = computed(() => ({
  marginLeft: `${appStore.sidebarWidth}px`,
}))
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;

  &-main {
    display: flex;
    min-height: 100vh;
    transition: margin-left $transition-duration $transition-timing;
    flex-direction: column;
  }
}

// 固定顶栏时的样式调整
:deep(.header.is-fixed) {
  top: 0;
  z-index: $z-index-sticky;
  position: sticky;
}
</style>
