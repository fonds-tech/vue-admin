<template>
  <div class="topbar">
    <div class="topbar__left">
      <!-- 侧边栏折叠按钮 -->
      <div class="action-btn" @click="appStore.toggleSidebar">
        <Icon :icon="appStore.sidebarCollapsed ? 'ri:menu-unfold-line' : 'ri:menu-fold-line'" :size="16" />
      </div>
    </div>

    <div class="right">
      <!-- 主题切换 -->
      <el-tooltip :content="isDark ? '亮色模式' : '暗色模式'">
        <div class="action-btn" @click="appStore.toggleTheme">
          <Icon :icon="isDark ? 'ri:sun-line' : 'ri:moon-line'" :size="16" />
        </div>
      </el-tooltip>

      <!-- 全屏 -->
      <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'">
        <div class="action-btn" @click="toggleFullscreen">
          <Icon :icon="isFullscreen ? 'ri:fullscreen-exit-line' : 'ri:fullscreen-line'" :size="16" />
        </div>
      </el-tooltip>

      <!-- 设置按钮 -->
      <el-tooltip content="设置">
        <div class="action-btn" @click="emit('openSettings')">
          <Icon icon="ri:settings-3-line" :size="16" />
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/app"

defineOptions({ name: "topbar" })

const emit = defineEmits<{ openSettings: [] }>()

const appStore = useAppStore()

const isDark = computed(() => appStore.theme === "dark")

/** 全屏状态 */
const isFullscreen = ref(false)

/** 切换全屏 */
function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
  else {
    document.documentElement.requestFullscreen()
  }
}

/** 监听全屏状态变化 */
function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener("fullscreenchange", handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange)
})
</script>

<style lang="scss" scoped>
.topbar {
  height: $header-height;
  display: flex;
  padding: 0 $spacing-md;
  align-items: center;
  justify-content: space-between;
  background-color: var(--el-bg-color);

  &__left {
    gap: $spacing-md;
    display: flex;
    align-items: center;
  }

  .right {
    gap: $spacing-md;
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
}
</style>
