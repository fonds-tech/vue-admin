<template>
  <el-row :gutter="16" class="stats-row">
    <el-col v-for="stat in stats" :key="stat.title" :xs="24" :sm="12" :lg="6">
      <div class="stat-card">
        <div class="stat-icon-wrapper" :style="{ background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)` }">
          <el-icon :size="28" :color="stat.color">
            <component :is="stat.icon" />
          </el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-header">
            <span class="stat-title">{{ stat.title }}</span>
            <span class="stat-trend" :class="{ 'is-up': stat.change.startsWith('+'), 'is-down': stat.change.startsWith('-') }">
              {{ stat.change }}
              <el-icon>
                <component :is="stat.change.startsWith('+') ? 'Top' : 'Bottom'" />
              </el-icon>
            </span>
          </div>
          <div class="stat-value-wrapper">
            <h3 class="stat-value">{{ stat.value }}</h3>
            <span class="stat-badge" :style="{ backgroundColor: `${stat.color}15`, color: stat.color }">
              {{ stat.badge }}
            </span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import type { PropType } from "vue"

defineProps({
  stats: {
    type: Array as PropType<
      Array<{
        title: string
        value: string
        icon: string
        color: string
        change: string
        badge: string
      }>
    >,
    default: () => [],
  },
})
</script>

<style lang="scss" scoped>
.stat-card {
  position: relative;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  height: 100%;
  padding: 20px;
  overflow: hidden;
  cursor: pointer;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  transition: all 0.3s ease;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    pointer-events: none;
    content: "";
    background: linear-gradient(135deg, transparent 0%, rgb(255 255 255 / 40%) 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover {
    border-color: transparent;
    box-shadow: 0 12px 24px -8px rgb(0 0 0 / 8%);
    transform: translateY(-4px);

    &::after {
      opacity: 1;
    }
  }

  .stat-icon-wrapper {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    transition: transform 0.3s;
  }

  &:hover .stat-icon-wrapper {
    transform: scale(1.05) rotate(5deg);
  }

  .stat-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    height: 56px;
  }

  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;

    .stat-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-secondary);
    }

    .stat-trend {
      display: flex;
      gap: 2px;
      align-items: center;
      font-size: 12px;
      font-weight: 600;

      &.is-up {
        color: var(--el-color-success);
      }

      &.is-down {
        color: var(--el-color-danger);
      }
    }
  }

  .stat-value-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .stat-value {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      line-height: 1.2;
      color: var(--el-text-color-primary);
    }

    .stat-badge {
      padding: 2px 8px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 10px;
    }
  }
}
</style>
