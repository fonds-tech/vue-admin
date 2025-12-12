<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>工作台</span>
        </div>
      </template>
      <el-empty description="工作台开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 工作台页面
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
