<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>菜单1-1</span>
        </div>
      </template>
      <el-empty description="多级菜单示例 - 菜单1-1" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 多级菜单1-1页面
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
