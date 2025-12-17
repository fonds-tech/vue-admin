<template>
  <div class="app-layout">
    <aside id="app-sidebar">
      <fd-sidebar />
    </aside>
    <main class="app-main">
      <fd-header-bar />
      <fd-process v-if="settingsStore.showProcess" />
      <fd-view />
    </main>
    <fd-setting />
  </div>
</template>

<script setup lang="ts">
import FdView from "./components/fd-view/index.vue"
import FdProcess from "./components/fd-process/index.vue"
import FdSetting from "./components/fd-setting"
import FdSidebar from "./components/fd-sidebar/index.vue"
import FdHeaderBar from "./components/fd-header-bar"
import { useSettingsStore } from "@/stores/settings"

const settingsStore = useSettingsStore()
</script>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: var(--el-bg-color);

  .app-sidebar {
    flex-shrink: 0;
  }

  .app-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
  }
}
</style>
