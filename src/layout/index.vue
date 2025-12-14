<template>
  <div class="app-layout">
    <aside id="app-sidebar">
      <fd-sidebar />
    </aside>
    <main class="app-main">
      <fd-header-bar />
      <fd-process v-if="appStore.showProcess" />
      <layout-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import FdProcess from "./components/fd-process/index.vue"
import FdSidebar from "./components/fd-sidebar/index.vue"
import LayoutView from "./components/view/index.vue"
import FdHeaderBar from "./components/fd-header-bar"
import { useAppStore } from "@/stores"

const appStore = useAppStore()
</script>

<style lang="scss" scoped>
.app-layout {
  height: 100vh;
  display: flex;
  overflow: hidden;
  background-color: var(--el-bg-color);

  .app-sidebar {
    flex-shrink: 0;
  }

  .app-main {
    flex: 1;
    display: flex;
    overflow-x: hidden;
    flex-direction: column;
  }
}
</style>
