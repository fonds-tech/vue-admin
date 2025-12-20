<template>
  <div v-if="show" class="fd-sidebar">
    <fd-vertical-menu />
  </div>
</template>

<script setup lang="ts">
import FdVerticalMenu from "../fd-vertical-menu/index.tsx"
import { computed } from "vue"
import { useSettingsStore } from "@/stores"

defineOptions({ name: "fd-sidebar" })

const settingsStore = useSettingsStore()

/** 是否显示侧边栏（水平菜单模式下隐藏） */
const show = computed(() => !settingsStore.isHorizontalLayout)
</script>

<style lang="scss">
.fd-sidebar {
  width: fit-content;
  height: 100vh;
  display: flex;
  user-select: none;
  flex-direction: column;

  @media screen and (max-width: 768px) {
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    position: fixed;
  }
}
</style>
