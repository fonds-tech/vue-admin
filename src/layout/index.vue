<template>
  <div class="app-layout">
    <aside id="app-sidebar">
      <fd-sidebar />
    </aside>
    <main class="app-main">
      <fd-header-bar />
      <fd-process />
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
import { ref, provide } from "vue"

// ===================== 移动端菜单状态管理 =====================
/** 移动端菜单是否打开 */
const mobileMenuOpen = ref(false)

/** 打开移动端菜单 */
function openMobileMenu() {
  mobileMenuOpen.value = true
}

/** 关闭移动端菜单 */
function closeMobileMenu() {
  mobileMenuOpen.value = false
}

// 提供给子组件使用
provide("mobileMenuOpen", mobileMenuOpen)
provide("openMobileMenu", openMobileMenu)
provide("closeMobileMenu", closeMobileMenu)
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
