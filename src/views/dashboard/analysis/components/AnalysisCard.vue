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
  margin-bottom: 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
    transform: translateY(-2px);
  }

  :deep(.el-card__body) {
    padding: 24px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    .card-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-regular);
    }
  }

  .card-content {
    .card-number {
      margin-bottom: 16px;
      font-family: "DIN Alternate", Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 32px;
      font-weight: 700;
      line-height: 1.2;
      color: var(--el-text-color-primary);
    }

    .card-desc {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      color: var(--el-text-color-secondary);

      .trend {
        display: flex;
        gap: 4px;
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
