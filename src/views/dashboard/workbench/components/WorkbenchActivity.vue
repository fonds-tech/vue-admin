<template>
  <el-card shadow="hover" class="list-card">
    <template #header>
      <div class="card-header">
        <span>动态</span>
        <span class="highlight">新增 +6</span>
      </div>
    </template>

    <div class="activity-list">
      <div v-for="(item, index) in activities" :key="index" class="activity-item">
        <div class="content">
          <span class="user">{{ item.user }}</span>
          <span class="action">{{ item.action }}</span>
          <span class="target">{{ item.target }}</span>
        </div>
        <div class="time">{{ item.time }}</div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
const activities = [
  { user: "中小鱼", action: "关注了", target: "辞辞念", time: "上午 09:30" },
  { user: "何小荷", action: "发表文章", target: "Vue3 + Typescript + Vite", time: "上午 10:30" },
  { user: "中小鱼", action: "关注了", target: "辞辞念", time: "上午 11:00" },
  { user: "何小荷", action: "发表文章", target: "Vue3 + Typescript + Vite", time: "下午 02:00" },
  { user: "辞辞念", action: "提出问题", target: "主题可以配置吗", time: "下午 03:30" },
  { user: "发呆草", action: "兑换了物品", target: "《奇特的一生》", time: "下午 06:30" },
]
</script>

<style scoped lang="scss">
.list-card {
  border: 1px solid var(--el-border-color-light);
  height: 100%;
  transition: all 0.3s;
  border-radius: 4px;
  margin-bottom: 12px;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
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

    .highlight {
      color: var(--el-color-success);
      padding: 2px 8px;
      font-size: 13px;
      border-radius: 4px;
      background-color: var(--el-color-success-light-9);
    }
  }

  .activity-list {
    padding: 0 12px;

    .activity-item {
      display: flex;
      padding: 16px 0;
      align-items: center;
      border-bottom: 1px solid var(--el-border-color-lighter);
      justify-content: space-between;

      &:last-child {
        border-bottom: none;
      }

      .content {
        color: var(--el-text-color-secondary);
        font-size: 14px;

        .user {
          color: var(--el-text-color-primary);
          font-weight: 500;
          margin-right: 4px;
        }

        .action {
          margin-right: 4px;
        }

        .target {
          color: var(--el-color-primary);
          cursor: pointer;
        }
      }

      .time {
        color: var(--el-text-color-placeholder);
        font-size: 12px;
      }
    }
  }
}
</style>
