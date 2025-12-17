<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>关于项目</span>
        </div>
      </template>
      <div class="about-content">
        <h2>Vue Admin</h2>
        <p>基于 Vue3 + TypeScript + Element Plus 的现代化后台管理系统</p>
        <el-divider />
        <el-descriptions :column="1" border>
          <el-descriptions-item label="框架">Vue 3</el-descriptions-item>
          <el-descriptions-item label="构建工具">Vite</el-descriptions-item>
          <el-descriptions-item label="UI组件库">Element Plus</el-descriptions-item>
          <el-descriptions-item label="状态管理">Pinia</el-descriptions-item>
          <el-descriptions-item label="路由">Vue Router</el-descriptions-item>
          <el-descriptions-item label="语言">TypeScript</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 关于项目页面
 */
</script>

<style lang="scss" scoped>
.page-container {
  padding: $spacing-base;
}

.card-header {
  font-weight: 600;
}

.about-content {
  text-align: center;

  h2 {
    margin-bottom: $spacing-sm;
    font-size: 24px;
    color: $primary-color;
  }

  p {
    margin-bottom: $spacing-base;
    color: $text-secondary;
  }

  .el-descriptions {
    max-width: 400px;
    margin: 0 auto;
  }
}
</style>
