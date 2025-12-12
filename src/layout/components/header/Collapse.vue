<template>
  <el-icon class="collapse-btn" @click="toggle">
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
.collapse-btn {
  cursor: pointer;
  font-size: 20px;
  transition: color $transition-duration;

  &:hover {
    color: $primary-color;
  }
}
</style>
