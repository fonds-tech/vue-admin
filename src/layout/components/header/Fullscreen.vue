<template>
  <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'">
    <el-icon class="header-action" @click="toggle">
      <FullScreen v-if="!isFullscreen" />
      <Aim v-else />
    </el-icon>
  </el-tooltip>
</template>

<script setup lang="ts">
/**
 * 全屏切换按钮
 */
import { ref, onMounted, onUnmounted } from "vue"

const isFullscreen = ref(false)

/** 切换全屏 */
function toggle() {
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
// 样式已移至全局 .header-icon-btn
</style>
