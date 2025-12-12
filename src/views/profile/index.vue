<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
        </div>
      </template>
      <el-empty description="个人信息页面开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 个人信息页面
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
