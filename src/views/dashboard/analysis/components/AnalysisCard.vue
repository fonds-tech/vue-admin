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

withDefaults(defineProps<Props>(), {
  tagText: "日",
  tagType: "success",
  desc: "较昨日",
  trend: "up",
  trendValue: "0%",
})
</script>

<style scoped lang="scss">
.analysis-card {
  border: 1px solid var(--el-border-color-light);
  transition: all 0.3s;
  border-radius: 4px;
  margin-bottom: 12px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
  }

  :deep(.el-card__body) {
    padding: 24px;
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    justify-content: space-between;

    .card-title {
      color: var(--el-text-color-regular);
      font-size: 14px;
      font-weight: 500;
    }
  }

  .card-content {
    .card-number {
      color: var(--el-text-color-primary);
      font-size: 32px;
      font-family: "DIN Alternate", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 16px;
    }

    .card-desc {
      color: var(--el-text-color-secondary);
      display: flex;
      font-size: 13px;
      align-items: center;
      justify-content: space-between;

      .trend {
        gap: 4px;
        display: flex;
        align-items: center;

        &.up {
          color: var(--el-color-success);
        }

        &.down {
          color: var(--el-color-danger);
        }

        .el-icon {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
