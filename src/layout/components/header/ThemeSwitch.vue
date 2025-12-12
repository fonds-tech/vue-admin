<template>
  <el-tooltip :content="isDark ? '亮色模式' : '暗色模式'">
    <el-icon class="header-action" @click="toggle">
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
.header-action {
  width: 36px;
  cursor: pointer;
  height: 36px;
  display: flex;
  font-size: 18px;
  transition: background-color $transition-duration;
  align-items: center;
  border-radius: $border-radius;
  justify-content: center;

  &:hover {
    background-color: $bg-color;
  }
}
</style>
