<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">500</div>
      <h1 class="error-title">服务器错误</h1>
      <p class="error-desc">抱歉，服务器出了点问题，请稍后再试</p>
      <div class="error-actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="refresh">刷新页面</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 500 服务器错误页面
 */
import { useRouter } from "vue-router"

const router = useRouter()

function goHome() {
  router.push("/")
}

function refresh() {
  window.location.reload()
}
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  background: $bg-page;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
}

.error-content {
  text-align: center;

  .error-code {
    color: $danger-color;
    font-size: 120px;
    font-weight: 700;
    line-height: 1;
    text-shadow: 4px 4px 0 rgb(239 68 68 / 30%);
  }

  .error-title {
    color: $text-primary;
    margin: $spacing-lg 0 $spacing-sm;
    font-size: 24px;
    font-weight: 600;
  }

  .error-desc {
    color: $text-secondary;
    font-size: 14px;
    margin-bottom: $spacing-xl;
  }

  .error-actions {
    gap: $spacing-sm;
    display: flex;
    justify-content: center;
  }
}
</style>
