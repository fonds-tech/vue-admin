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
            <span
              class="stat-trend"
              :class="{ 'is-up': stat.change.startsWith('+'), 'is-down': stat.change.startsWith('-') }"
            >
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
    type: Array as PropType<Array<{
      title: string
      value: string
      icon: string
      color: string
      change: string
      badge: string
    }>>,
    default: () => [],
  },
})
</script>

<style lang="scss" scoped>
.stat-card {
  gap: 16px;
  border: 1px solid var(--el-border-color-lighter);
  cursor: pointer;
  height: 100%;
  display: flex;
  padding: 20px;
  overflow: hidden;
  position: relative;
  background: var(--el-bg-color);
  transition: all 0.3s ease;
  align-items: flex-start;
  border-radius: 12px;

  &::after {
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    content: "";
    opacity: 0;
    position: absolute;
    background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.4) 100%);
    transition: opacity 0.3s;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.08);
    border-color: transparent;

    &::after {
      opacity: 1;
    }
  }

  .stat-icon-wrapper {
    width: 56px;
    height: 56px;
    display: flex;
    transition: transform 0.3s;
    align-items: center;
    flex-shrink: 0;
    border-radius: 16px;
    justify-content: center;
  }

  &:hover .stat-icon-wrapper {
    transform: scale(1.05) rotate(5deg);
  }

  .stat-info {
    flex: 1;
    height: 56px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .stat-header {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    justify-content: space-between;

    .stat-title {
      color: var(--el-text-color-secondary);
      font-size: 14px;
      font-weight: 500;
    }

    .stat-trend {
      gap: 2px;
      display: flex;
      font-size: 12px;
      align-items: center;
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
      color: var(--el-text-color-primary);
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      line-height: 1.2;
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
