<template>
  <div class="fd-sidebar" :style="sidebarStyle">
    <fd-logo v-if="!settingsStore.isDualLayout" show-title />
    <fd-vertical-menu />
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue"
import FdLogo from "../fd-logo/index.vue"
import FdVerticalMenu from "../fd-vertical-menu/index.tsx"
import { computed } from "vue"
import { useSettingsStore } from "@/stores/settings"

defineOptions({ name: "fd-sidebar" })

const settingsStore = useSettingsStore()

/** 计算 sidebar 宽度 */
const sidebarStyle = computed<CSSProperties>(() => {
  // 双列模式：左侧64px + 右侧menuWidth
  if (settingsStore.isDualLayout) {
    return { width: `${64 + settingsStore.menuWidth}px` }
  }
  // 单列模式：使用 menuWidth
  return { width: `${settingsStore.menuWidth}px` }
})
</script>

<style lang="scss">
.fd-sidebar {
  height: 100vh;
  display: flex;
  flex-shrink: 0;
  user-select: none;
  border-right: 1px solid var(--el-border-color);
  flex-direction: column;
}
</style>
