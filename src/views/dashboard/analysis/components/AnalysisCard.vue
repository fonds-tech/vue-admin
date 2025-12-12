<template>
  <el-card shadow="hover" class="analysis-card">
    <div class="card-header">
      <span class="card-title">{{ title }}</span>
      <el-tag :type="tagType" size="small">{{ tagText }}</el-tag>
    </div>
    <div class="card-content">
      <div class="card-number">{{ number }}</div>
      <div class="card-desc">
        <span>{{ desc }}</span>
        <span class="trend" :class="[trend === 'up' ? 'up' : 'down']">
          {{ trendValue }}
          <el-icon><component :is="trend === 'up' ? 'Top' : 'Bottom'" /></el-icon>
        </span>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  number: string
  tagText?: string
  tagType?: "primary" | "success" | "warning" | "info" | "danger"
  desc?: string
  trend?: "up" | "down"
  trendValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  tagText: "日",
  tagType: "success",
  desc: "较昨日",
  trend: "up",
  trendValue: "0%",
})
</script>

<style scoped lang="scss">
.analysis-card {
  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    justify-content: space-between;
    .card-title {
      color: var(--el-text-color-secondary);
      font-size: 14px;
    }
  }
  .card-content {
    .card-number {
      color: var(--el-text-color-primary);
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .card-desc {
      color: var(--el-text-color-secondary);
      display: flex;
      font-size: 12px;
      justify-content: space-between;
      .trend {
        display: flex;
        align-items: center;
        &.up {
          color: var(--el-color-success);
        }
        &.down {
          color: var(--el-color-danger);
        }
      }
    }
  }
}
</style>
