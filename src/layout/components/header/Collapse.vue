<template>
  <el-icon class="header-icon-btn" @click="toggle">
    <Fold v-if="!collapsed" />
    <Expand v-else />
  </el-icon>
</template>

<script setup lang="ts">
/**
 * 侧边栏折叠/展开按钮
 */
defineProps<{
  /** 是否折叠 */
  collapsed?: boolean
}>()

const emit = defineEmits<{
  toggle: []
}>()

function toggle() {
  emit("toggle")
}
</script>

<style lang="scss" scoped>
// 样式已移至全局 .header-icon-btn
</style>
