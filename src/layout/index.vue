<template>
  <div class="app-layout">
    <aside id="app-sidebar">
      <fd-sidebar />
    </aside>
    <main class="app-main">
      <fd-header />
      <fd-process />
      <fd-view />
    </main>

    <fd-search />
    <fd-setting />
  </div>
</template>

<script setup lang="ts">
import FdView from "./components/fd-view/index.vue"
import FdHeader from "./components/fd-header"
import FdSearch from "./components/fd-search"
import FdProcess from "./components/fd-process/index.vue"
import FdSetting from "./components/fd-setting"
import FdSidebar from "./components/fd-sidebar/index.vue"
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
    overflow: hidden;
    flex-direction: column;
  }
}
</style>
