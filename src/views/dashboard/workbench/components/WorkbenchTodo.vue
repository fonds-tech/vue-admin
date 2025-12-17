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
  height: 100%;
  margin-bottom: 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
  }

  :deep(.el-card__header) {
    padding: 16px 24px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    color: var(--el-text-color-primary);

    .count {
      font-size: 13px;
      color: var(--el-text-color-secondary);

      .num {
        font-weight: 600;
        color: var(--el-color-danger);
      }
    }
  }

  .todo-list {
    padding: 0 12px;

    .todo-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }

      .content {
        .title {
          margin-bottom: 4px;
          font-size: 14px;
          color: var(--el-text-color-primary);
        }

        .time {
          font-size: 12px;
          color: var(--el-text-color-placeholder);
        }
      }
    }
  }
}
</style>
