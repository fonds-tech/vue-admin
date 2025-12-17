<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">403</div>
      <h1 class="error-title">权限不足</h1>
      <p class="error-desc">抱歉，您没有权限访问此页面</p>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 403 权限不足页面
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
    color: $warning-color;
    text-shadow: 4px 4px 0 rgb(245 158 11 / 30%);
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
