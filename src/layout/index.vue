<template>
  <div class="layout">
    <!-- 侧边栏 -->
    <layout-sidebar />

    <!-- 主体区域 -->
    <div class="layout-main" :style="mainStyle">
      <!-- 顶栏 -->
      <layout-header />

      <!-- 内容区 -->
      <main class="layout-content">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <keep-alive :include="[]">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 主布局组件
 */
import LayoutHeader from "./components/Header.vue"
import LayoutSidebar from "./components/Sidebar.vue"
import { computed } from "vue"
import { useAppStore } from "@/stores/app"

const appStore = useAppStore()

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

  &-content {
    flex: 1;
    padding: $spacing-base;
    background-color: $bg-page;
  }
}
</style>
