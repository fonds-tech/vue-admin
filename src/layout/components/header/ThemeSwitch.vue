<template>
  <el-tooltip :content="isDark ? '亮色模式' : '暗色模式'">
    <el-icon class="header-icon-btn" @click="toggle">
      <Sunny v-if="isDark" />
      <Moon v-else />
    </el-icon>
  </el-tooltip>
</template>

<script setup lang="ts">
/**
 * 主题切换按钮
 */
import { computed } from "vue"
import { useAppStore } from "@/stores/app"

const appStore = useAppStore()

/** 是否为暗色模式 */
const isDark = computed(() => appStore.theme === "dark")

/** 切换主题 */
function toggle() {
  appStore.toggleTheme()
}
</script>

<style lang="scss" scoped>
// 样式已移至全局 .header-icon-btn
</style>
