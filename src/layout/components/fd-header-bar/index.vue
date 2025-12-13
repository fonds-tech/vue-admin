<template>
  <div class="fd-header-bar">
    <div class="fd-header-bar__left">
      <!-- 折叠按钮 -->
      <div class="action-btn" @click="handleToggleCollapse">
        <icon :icon="collapseIcon" :size="20" />
      </div>
      <fd-breadcrumb />
    </div>
    <div class="fd-header-bar__right"></div>
  </div>
</template>

<script setup lang="ts">
import FdBreadcrumb from "../fd-breadcrumb/index.vue"
import { Icon } from "@/components/core/fd-icon"
import { computed } from "vue"
import { useSettingsStore } from "@/stores/settings"

defineOptions({ name: "fd-header-bar" })

const settingsStore = useSettingsStore()

/** 折叠图标 */
const collapseIcon = computed(() => {
  return settingsStore.isMenuCollapsed ? "ri:menu-unfold-line" : "ri:menu-fold-line"
})

/** 切换折叠状态 */
function handleToggleCollapse() {
  settingsStore.toggleMenuCollapsed()
}
</script>

<style lang="scss">
.fd-header-bar {
  height: 50px;
  display: flex;
  padding: 0 12px;
  align-items: center;
  justify-content: space-between;

  &__left {
    gap: 12px;
    display: flex;
    align-items: center;
  }

  &__right {
    gap: 12px;
    display: flex;
    align-items: center;
  }

  .action-btn {
    width: 30px;
    border: 1px solid var(--el-fill-color-dark);
    cursor: pointer;
    height: 30px;
    display: flex;
    transition: all 0.2s ease-in-out;
    align-items: center;
    border-radius: 6px;
    justify-content: center;

    &:hover {
      border-color: var(--el-color-primary);
      background-color: transparent;
    }
  }

  // 折叠按钮
  &__collapse-btn {
    color: var(--el-text-color-regular);
    width: 36px;
    cursor: pointer;
    height: 36px;
    display: flex;
    transition: all 0.2s ease;
    align-items: center;
    border-radius: var(--el-border-radius-base);
    justify-content: center;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
  }
}
</style>
