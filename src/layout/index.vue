<template>
  <div class="layout">
    <div class="layout__sidebar">
      <sidebar />
    </div>
    <div class="layout__content">
      <topbar />
      <process v-if="appStore.showProcess" />
      <layout-view />
    </div>

    <!-- 水印 -->
    <layout-watermark />

    <!-- 设置抽屉 -->
    <layout-settings v-model="settingsVisible" />
  </div>
</template>

<script setup lang="ts">
import Topbar from "./components/topbar/index.vue"
import Process from "./components/process/index.vue"
import Sidebar from "./components/sidebar/index.vue"
import LayoutView from "./components/view/index.vue"
import LayoutSettings from "./components/settings/index.vue"
import LayoutWatermark from "./components/watermark/index.vue"
import { ref } from "vue"
import { useAppStore } from "@/stores"

const appStore = useAppStore()

/** 设置抽屉是否可见 */
const settingsVisible = ref(false)
</script>

<style lang="scss" scoped>
.layout {
  height: 100vh;
  display: flex;
  overflow: hidden;

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>
