<template>
  <div class="analysis-container">
    <!-- 统计卡片 -->
    <el-row :gutter="12">
      <el-col v-for="(item, index) in statisticsData" :key="index" :xs="24" :sm="12" :md="6">
        <analysis-card
          :title="item.title"
          :number="item.number"
          :tag-text="item.tagText"
          :tag-type="item.tagType"
          :desc="item.desc"
          :trend="item.trend"
          :trend-value="item.trendValue"
        />
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="12">
      <el-col :xs="24" :lg="16">
        <analysis-line-chart />
      </el-col>
      <el-col :xs="24" :lg="8">
        <analysis-bar-chart />
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-card shadow="hover" class="table-card">
      <template #header>
        <div class="card-header">
          <span>最近交易记录</span>
          <el-button type="primary" link>查看更多</el-button>
        </div>
      </template>
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="orderNo" label="订单编号" width="180" />
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column prop="amount" label="金额">
          <template #default="scope">
            ¥{{ scope.row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import AnalysisCard from "./components/AnalysisCard.vue"
import AnalysisBarChart from "./components/AnalysisBarChart.vue"
import AnalysisLineChart from "./components/AnalysisLineChart.vue"

// 统计卡片数据
const statisticsData = [
  {
    title: "总访问量",
    number: "126,560",
    tagText: "日",
    tagType: "success" as const,
    desc: "较昨日",
    trend: "up" as const,
    trendValue: "12%",
  },
  {
    title: "销售额",
    number: "¥88,460",
    tagText: "月",
    tagType: "warning" as const,
    desc: "较上月",
    trend: "down" as const,
    trendValue: "5%",
  },
  {
    title: "订单量",
    number: "1,203",
    tagText: "周",
    tagType: "info" as const,
    desc: "较上周",
    trend: "up" as const,
    trendValue: "23%",
  },
  {
    title: "活跃用户",
    number: "12,345",
    tagText: "日",
    tagType: "danger" as const,
    desc: "较昨日",
    trend: "up" as const,
    trendValue: "8%",
  },
]

// 表格数据
const tableData = [
  {
    orderNo: "202412120001",
    user: "张三",
    amount: "128.00",
    status: 1,
    date: "2024-12-12 10:23:45",
  },
  {
    orderNo: "202412120002",
    user: "李四",
    amount: "648.00",
    status: 0,
    date: "2024-12-12 10:25:12",
  },
  {
    orderNo: "202412120003",
    user: "王五",
    amount: "56.50",
    status: 1,
    date: "2024-12-12 10:30:00",
  },
  {
    orderNo: "202412120004",
    user: "赵六",
    amount: "1024.00",
    status: 2,
    date: "2024-12-12 11:15:20",
  },
  {
    orderNo: "202412120005",
    user: "孙七",
    amount: "99.00",
    status: 1,
    date: "2024-12-12 11:45:00",
  },
]

function getStatusType(status: number) {
  switch (status) {
    case 1:
      return "success"
    case 0:
      return "warning"
    case 2:
      return "danger"
    default:
      return "info"
  }
}

function getStatusText(status: number) {
  switch (status) {
    case 1:
      return "已完成"
    case 0:
      return "待支付"
    case 2:
      return "已取消"
    default:
      return "未知"
  }
}
</script>

<style scoped lang="scss">
.analysis-container {
  flex: 1;
  padding: 12px;

  .table-card {
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

    :deep(.el-card__body) {
      padding: 0;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      span {
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-primary);
      }
    }

    :deep(.el-table) {
      border-radius: 0 0 4px 4px;

      th.el-table__cell {
        font-weight: 500;
        color: var(--el-text-color-regular);
        background-color: var(--el-fill-color-light);
      }

      .el-table__cell {
        padding: 12px 0;
      }
    }
  }
}
</style>
