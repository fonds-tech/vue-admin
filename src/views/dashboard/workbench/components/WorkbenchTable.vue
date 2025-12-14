<template>
  <el-card shadow="hover" class="list-card">
    <template #header>
      <div class="card-header">
        <span>新用户</span>
        <div class="actions">
          <el-button-group size="small">
            <el-button type="primary" plain>本月</el-button>
            <el-button>上月</el-button>
            <el-button>今年</el-button>
          </el-button-group>
        </div>
      </div>
      <div class="sub-header">
        这个月增长 <span class="highlight">+20%</span>
      </div>
    </template>

    <el-table :data="tableData" style="width: 100%" :show-header="true">
      <el-table-column label="头像" width="70">
        <template #default="scope">
          <el-avatar :size="32" :src="scope.row.avatar" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="region" label="地区" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column label="进度" width="150">
        <template #default="scope">
          <el-progress :percentage="scope.row.progress" :color="scope.row.color" :show-text="true" />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
const tableData = [
  {
    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    name: "中小鱼",
    region: "北京",
    gender: "女",
    progress: 60,
    color: "#409EFF",
  },
  {
    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    name: "何小荷",
    region: "深圳",
    gender: "男",
    progress: 20,
    color: "#409EFF",
  },
  {
    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    name: "辞辞念",
    region: "上海",
    gender: "男",
    progress: 60,
    color: "#E6A23C",
  },
  {
    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    name: "发呆草",
    region: "长沙",
    gender: "女",
    progress: 50,
    color: "#909399",
  },
  {
    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    name: "甜筒",
    region: "浙江",
    gender: "男",
    progress: 70,
    color: "#F56C6C",
  },
  {
    avatar: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
    name: "冷月呆呆",
    region: "湖北",
    gender: "男",
    progress: 90,
    color: "#67C23A",
  },
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
  }

  .sub-header {
    color: var(--el-text-color-secondary);
    font-size: 13px;
    margin-top: 8px;
    .highlight {
      color: var(--el-color-success);
    }
  }
}
</style>
