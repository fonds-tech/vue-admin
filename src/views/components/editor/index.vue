<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>富文本编辑器</span>
        </div>
      </template>
      <el-empty description="富文本编辑器示例开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 富文本编辑器示例页面
 */
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-base;
}

.card-header {
  font-weight: 600;
}
</style>
