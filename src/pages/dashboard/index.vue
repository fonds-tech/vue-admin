<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col v-for="stat in stats" :key="stat.title" :xs="24" :sm="12" :lg="6">
        <div class="stat-card">
          <div class="stat-icon" :style="{ backgroundColor: `${stat.color}20`, color: stat.color }">
            <el-icon :size="24">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">{{ stat.value }}</h3>
            <p class="stat-title">{{ stat.title }}</p>
          </div>
          <div class="stat-change" :class="{ positive: stat.change.startsWith('+') }">
            {{ stat.change }}
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 主要内容 -->
    <el-row :gutter="16">
      <!-- 快捷入口 -->
      <el-col :xs="24" :lg="8">
        <el-card class="dashboard-card">
          <template #header>
            <span>快捷入口</span>
          </template>
          <div class="shortcuts">
            <router-link v-for="item in shortcuts" :key="item.path" :to="item.path" class="shortcut-item">
              <el-icon :size="20">
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.title }}</span>
            </router-link>
          </div>
        </el-card>
      </el-col>

      <!-- 待办事项 -->
      <el-col :xs="24" :lg="16">
        <el-card class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
              <el-button type="primary" link>查看全部</el-button>
            </div>
          </template>
          <el-empty description="暂无待办事项" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
/**
 * 仪表盘页面
 */
import { ref } from "vue"

// 统计数据
const stats = ref([
  { title: "总用户数", value: "8,846", icon: "User", color: "#4f46e5", change: "+12.5%" },
  { title: "活跃用户", value: "2,156", icon: "UserFilled", color: "#10b981", change: "+8.2%" },
  { title: "订单总数", value: "15,890", icon: "ShoppingCart", color: "#f59e0b", change: "+23.1%" },
  { title: "总收入", value: "¥48,250", icon: "Money", color: "#ef4444", change: "+5.6%" },
])

// 快捷入口
const shortcuts = ref([
  { title: "用户管理", icon: "User", path: "/system/user" },
  { title: "角色管理", icon: "UserFilled", path: "/system/role" },
  { title: "菜单管理", icon: "Menu", path: "/system/menu" },
  { title: "系统设置", icon: "Setting", path: "/system/setting" },
])
</script>

<style lang="scss" scoped>
.dashboard {
  gap: $spacing-base;
  display: flex;
  flex-direction: column;
}

.stats-row {
  margin-bottom: $spacing-sm;
}

.stat-card {
  gap: $spacing-base;
  display: flex;
  padding: $spacing-lg;
  background: $bg-white;
  box-shadow: $shadow-sm;
  transition: box-shadow $transition-duration;
  align-items: center;
  border-radius: $border-radius-lg;

  &:hover {
    box-shadow: $shadow-md;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    border-radius: $border-radius;
    justify-content: center;
  }

  .stat-content {
    flex: 1;

    .stat-value {
      color: $text-primary;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .stat-title {
      color: $text-secondary;
      font-size: 13px;
    }
  }

  .stat-change {
    color: $danger-color;
    padding: 4px 8px;
    font-size: 12px;
    background: rgb(239 68 68 / 10%);
    font-weight: 500;
    border-radius: $border-radius-sm;

    &.positive {
      color: $success-color;
      background: rgb(16 185 129 / 10%);
    }
  }
}

.dashboard-card {
  height: 100%;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.shortcuts {
  gap: $spacing-sm;
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  .shortcut-item {
    gap: $spacing-sm;
    color: $text-primary;
    display: flex;
    padding: $spacing-base;
    background: $bg-color;
    transition: all $transition-duration;
    align-items: center;
    border-radius: $border-radius;
    text-decoration: none;

    &:hover {
      color: $primary-color;
      background: rgb(79 70 229 / 10%);
    }
  }
}
</style>
