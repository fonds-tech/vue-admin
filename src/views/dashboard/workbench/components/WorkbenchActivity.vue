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

    .highlight {
      padding: 2px 8px;
      font-size: 13px;
      color: var(--el-color-success);
      background-color: var(--el-color-success-light-9);
      border-radius: 4px;
    }
  }

  .activity-list {
    padding: 0 12px;

    .activity-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid var(--el-border-color-lighter);

      &:last-child {
        border-bottom: none;
      }

      .content {
        font-size: 14px;
        color: var(--el-text-color-secondary);

        .user {
          margin-right: 4px;
          font-weight: 500;
          color: var(--el-text-color-primary);
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
        font-size: 12px;
        color: var(--el-text-color-placeholder);
      }
    }
  }
}
</style>
