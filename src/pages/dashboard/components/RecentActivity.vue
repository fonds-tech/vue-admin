<template>
  <div class="activity-card">
    <div class="card-header">
      <h3 class="title">最近动态</h3>
      <el-button type="primary" link>查看更多</el-button>
    </div>

    <div class="activity-list">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :type="activity.type"
          :color="activity.color"
          :hollow="activity.hollow"
          :timestamp="activity.timestamp"
        >
          <div class="activity-content">
            <span class="activity-title">{{ activity.title }}</span>
            <p v-if="activity.description" class="activity-desc">{{ activity.description }}</p>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

interface ActivityItem {
  title: string
  description?: string
  timestamp: string
  color: string
  type?: "primary" | "success" | "warning" | "danger" | "info"
  hollow: boolean
}

const activities = ref<ActivityItem[]>([
  {
    title: "系统升级完成",
    description: "版本 v2.4.0 已成功发布",
    timestamp: "刚刚",
    color: "#10b981",
    type: "success",
    hollow: false,
  },
  {
    title: "新用户注册",
    description: "欢迎新用户 \"Alex Dr.\"",
    timestamp: "25分钟前",
    color: "#4f46e5",
    hollow: true,
  },
  {
    title: "大额订单通知",
    description: "收到新的大额订单 #ORDER-8859",
    timestamp: "42分钟前",
    color: "#f59e0b",
    hollow: true,
  },
  {
    title: "系统警告",
    description: "服务器 CPU 使用率超过 80%",
    timestamp: "1小时前",
    color: "#ef4444",
    type: "warning",
    hollow: false,
  },
  {
    title: "任务完成",
    description: "前端性能优化任务已归档",
    timestamp: "3小时前",
    color: "#909399",
    hollow: true,
  },
])
</script>

<style lang="scss" scoped>
.activity-card {
  border: 1px solid var(--el-border-color-lighter);
  height: 100%;
  padding: 24px;
  background: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
  border-radius: 12px;

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    justify-content: space-between;

    .title {
      color: var(--el-text-color-primary);
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .activity-list {
    padding-left: 4px;

    .activity-content {
      .activity-title {
        color: var(--el-text-color-primary);
        font-size: 14px;
        font-weight: 500;
      }

      .activity-desc {
        color: var(--el-text-color-secondary);
        margin: 4px 0 0;
        font-size: 13px;
      }
    }
  }
}
</style>
