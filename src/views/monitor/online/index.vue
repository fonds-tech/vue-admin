<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>在线用户</span>
        </div>
      </template>
      <el-empty description="在线用户监控开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 在线用户监控页面
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
