<template>
  <el-card shadow="hover" class="list-card">
    <template #header>
      <div class="card-header">
        <span>代办事项</span>
        <span class="count">待处理 <span class="num">3</span></span>
      </div>
    </template>

    <div class="todo-list">
      <div v-for="(item, index) in todos" :key="index" class="todo-item">
        <div class="content">
          <div class="title">{{ item.title }}</div>
          <div class="time">{{ item.time }}</div>
        </div>
        <el-checkbox v-model="item.checked" />
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from "vue"

const todos = reactive([
  { title: "查看今天工作内容", time: "上午 09:30", checked: true },
  { title: "回复邮件", time: "上午 10:30", checked: true },
  { title: "工作汇报整理", time: "上午 11:00", checked: true },
  { title: "产品需求会议", time: "下午 02:00", checked: false },
  { title: "整理会议内容", time: "下午 03:30", checked: false },
  { title: "明天工作计划", time: "下午 06:30", checked: false },
])
</script>

<style scoped lang="scss">
.list-card {
  border: 1px solid var(--el-border-color-light);
  height: 100%;
  transition: all 0.3s;
  border-radius: 4px;
  margin-bottom: 12px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  :deep(.el-card__header) {
    padding: 16px 24px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .card-header {
    color: var(--el-text-color-primary);
    display: flex;
    font-size: 16px;
    align-items: center;
    font-weight: 500;
    justify-content: space-between;

    .count {
      color: var(--el-text-color-secondary);
      font-size: 13px;
      .num {
        color: var(--el-color-danger);
        font-weight: 600;
      }
    }
  }

  .todo-list {
    padding: 0 12px;
    .todo-item {
      display: flex;
      padding: 16px 0;
      align-items: center;
      border-bottom: 1px solid var(--el-border-color-lighter);
      justify-content: space-between;

      &:last-child {
        border-bottom: none;
      }

      .content {
        .title {
          color: var(--el-text-color-primary);
          font-size: 14px;
          margin-bottom: 4px;
        }
        .time {
          color: var(--el-text-color-placeholder);
          font-size: 12px;
        }
      }
    }
  }
}
</style>
