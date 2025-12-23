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

      <!-- 待办 -->
      <el-col :xs="24" :lg="8">
        <div class="right-panel">
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
