<template>
  <div class="sidebar" :width="width">
    <sidebar-logo :collapsed="appStore.sidebarCollapsed" />
    <sidebar-menu :collapsed="appStore.sidebarCollapsed" />
  </div>
</template>

<script setup lang="ts">
import SidebarLogo from "../logo/index.vue"
import SidebarMenu from "../menu/index.tsx"
import { computed } from "vue"
import { useAppStore } from "@/stores/app"

defineOptions({ name: "sidebar" })

const appStore = useAppStore()

const width = computed(() => `${appStore.sidebarWidth}px`)
</script>

<style lang="scss" scoped>
.sidebar {
  width: $sidebar-width;
  display: flex;
  overflow: hidden;
  position: relative;
  flex-direction: column;
  &::before {
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    content: "";
    position: absolute;
    background-color: var(--el-menu-border-color);
  }
}
</style>
