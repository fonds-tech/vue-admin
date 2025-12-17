<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-desc">抱歉，您访问的页面不存在或已被删除</p>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 404 错误页面
 */
import { useRouter } from "vue-router"

const router = useRouter()

function goHome() {
  router.push("/")
}

function goBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: $bg-page;
}

.error-content {
  text-align: center;

  .error-code {
    font-size: 120px;
    font-weight: 700;
    line-height: 1;
    color: $primary-color;
    text-shadow: 4px 4px 0 $primary-light;
  }

  .error-title {
    margin: $spacing-lg 0 $spacing-sm;
    font-size: 24px;
    font-weight: 600;
    color: $text-primary;
  }

  .error-desc {
    margin-bottom: $spacing-xl;
    font-size: 14px;
    color: $text-secondary;
  }

  .error-actions {
    display: flex;
    gap: $spacing-sm;
    justify-content: center;
  }
}
</style>
