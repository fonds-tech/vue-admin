<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <dashboard-stats :stats="stats" />

    <!-- 趋势图 -->
    <el-row :gutter="16" class="mt-4">
      <el-col :span="24">
        <dashboard-line-chart />
      </el-col>
    </el-row>

    <!-- 底部内容 -->
    <el-row :gutter="16" class="mt-4">
      <!-- 最近动态 -->
      <el-col :xs="24" :lg="16">
        <recent-activity />
      </el-col>

      <!-- 快捷入口与待办 -->
      <el-col :xs="24" :lg="8">
        <div class="right-panel">
          <!-- 快捷入口 -->
          <el-card shadow="hover" class="dashboard-card mb-4">
            <template #header>
              <div class="card-header">
                <span class="title">快捷入口</span>
              </div>
            </template>
            <div class="shortcuts">
              <router-link v-for="item in shortcuts" :key="item.path" :to="item.path" class="shortcut-item">
                <div class="icon-box" :style="{ color: item.color, backgroundColor: item.bg }">
                  <el-icon :size="20">
                    <component :is="item.icon" />
                  </el-icon>
                </div>
                <span>{{ item.title }}</span>
              </router-link>
            </div>
          </el-card>

          <!-- 待办事项 -->
          <el-card shadow="hover" class="dashboard-card">
            <template #header>
              <div class="card-header">
                <span class="title">待办事项</span>
                <el-button type="primary" link>查看</el-button>
              </div>
            </template>
            <div class="todo-list">
              <div v-for="item in todos" :key="item.id" class="todo-item">
                <el-checkbox v-model="item.done">{{ item.title }}</el-checkbox>
                <el-tag size="small" :type="item.tagType">{{ item.tag }}</el-tag>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import DashboardStats from "./components/DashboardStats.vue"
import RecentActivity from "./components/RecentActivity.vue"
import DashboardLineChart from "./components/DashboardLineChart.vue"
import { ref } from "vue"

// 统计数据
const stats = ref([
  { title: "总用户数", value: "8,846", icon: "User", color: "#4f46e5", change: "+12.5%", badge: "总计" },
  { title: "活跃用户", value: "2,156", icon: "UserFilled", color: "#10b981", change: "+8.2%", badge: "日活" },
  { title: "订单总数", value: "15,890", icon: "ShoppingCart", color: "#f59e0b", change: "+23.1%", badge: "本月" },
  { title: "总收入", value: "¥48,250", icon: "Money", color: "#ef4444", change: "+5.6%", badge: "净收" },
])

// 快捷入口
const shortcuts = ref([
  { title: "用户管理", icon: "User", path: "/system/user", color: "#4f46e5", bg: "rgba(79, 70, 229, 0.1)" },
  { title: "角色管理", icon: "UserFilled", path: "/system/role", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
  { title: "菜单管理", icon: "Menu", path: "/system/menu", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
  { title: "系统设置", icon: "Setting", path: "/system/setting", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" },
])

// 待办事项
const todos = ref([
  { id: 1, title: "审核新用户注册", done: false, tag: "待审核", tagType: "warning" as const },
  { id: 2, title: "系统安全检查", done: false, tag: "高优", tagType: "danger" as const },
  { id: 3, title: "更新产品文档", done: true, tag: "普通", tagType: "info" as const },
  { id: 4, title: "回复客户咨询", done: false, tag: "进行中", tagType: "primary" as const },
])
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;

  .mt-4 {
    margin-top: 16px;
  }

  .mb-4 {
    margin-bottom: 16px;
  }
}

.dashboard-card {
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;

  :deep(.el-card__header) {
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      color: var(--el-text-color-primary);
      font-size: 16px;
      font-weight: 600;
    }
  }
}

.shortcuts {
  gap: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  .shortcut-item {
    gap: 12px;
    color: var(--el-text-color-regular);
    border: 1px solid transparent;
    display: flex;
    padding: 16px;
    background: var(--el-bg-color-page);
    transition: all 0.3s;
    align-items: center;
    border-radius: 8px;
    text-decoration: none;

    &:hover {
      transform: translateY(-2px);
      background: var(--el-bg-color);
      box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
      border-color: var(--el-border-color-lighter);
    }

    .icon-box {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      border-radius: 10px;
      justify-content: center;
    }
  }
}

.todo-list {
  gap: 12px;
  display: flex;
  flex-direction: column;

  .todo-item {
    display: flex;
    padding: 8px 0;
    align-items: center;
    border-bottom: 1px dashed var(--el-border-color-lighter);
    justify-content: space-between;

    &:last-child {
      border-bottom: none;
    }
  }
}

.right-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
