<template>
  <el-card shadow="hover" class="workbench-card">
    <div class="card-header">
      <span class="card-title">{{ title }}</span>
      <el-tag v-if="tagText" :type="tagType" effect="dark">
        <el-icon v-if="icon"><component :is="icon" /></el-icon>
      </el-tag>
    </div>
    <div class="card-content">
      <div class="card-number">{{ number }}</div>
      <div class="card-desc">
        <span>{{ desc }}</span>
        <span class="trend" :class="[trend === 'up' ? 'up' : 'down']">
          {{ trendValue }}
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
  icon?: string
  desc?: string
  trend?: "up" | "down"
  trendValue?: string
}

withDefaults(defineProps<Props>(), {
  tagType: "primary",
  desc: "较上周",
  trend: "up",
})
</script>

<style scoped lang="scss">
.workbench-card {
  margin-bottom: 12px;
  background-color: var(--el-bg-color-overlay);
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
      }
    }
  }
}
</style>
