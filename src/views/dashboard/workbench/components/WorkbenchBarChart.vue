<template>
  <el-card shadow="hover" class="chart-card">
    <template #header>
      <div class="card-header">
        <div class="title-box">
          <span class="title">用户概述</span>
          <span class="subtitle">比上周 <span class="highlight">+23%</span></span>
        </div>
        <div class="desc">我们将为您创建了多个选项，可将它们组合在一起并定制为完美像素的页面</div>
        <div class="stats-row">
          <div class="stat-item">
            <div class="num">32k</div>
            <div class="label">总用户量</div>
          </div>
          <div class="stat-item">
            <div class="num">128k</div>
            <div class="label">总访问量</div>
          </div>
          <div class="stat-item">
            <div class="num">1.2k</div>
            <div class="label">日访问量</div>
          </div>
          <div class="stat-item">
            <div class="num">+5%</div>
            <div class="label">周同比</div>
          </div>
        </div>
      </div>
    </template>
    <div ref="chartRef" style="width: 100%; height: 280px"></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import * as echarts from "echarts"

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

function initChart() {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    const option = {
      grid: {
        left: "0",
        right: "0",
        top: "20",
        bottom: "0",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      xAxis: {
        type: "category",
        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月"],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#909399" },
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#E4E7ED",
          },
        },
        axisLabel: { color: "#909399" },
      },
      series: [
        {
          name: "用户量",
          type: "bar",
          barWidth: 20,
          data: [160, 100, 150, 80, 220, 100, 205, 120, 160],
          itemStyle: {
            color: "#409EFF",
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    }
    chartInstance.setOption(option)
  }
}

function resizeChart() {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener("resize", resizeChart)
})

onUnmounted(() => {
  window.removeEventListener("resize", resizeChart)
  chartInstance?.dispose()
})
</script>

<style scoped lang="scss">
.chart-card {
  height: 100%;
  margin-bottom: 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
  }

  :deep(.el-card__header) {
    padding: 24px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-card__body) {
    padding: 24px;
  }

  .card-header {
    .title-box {
      margin-bottom: 8px;

      .title {
        margin-right: 12px;
        font-size: 18px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .subtitle {
        font-size: 14px;
        color: var(--el-text-color-secondary);

        .highlight {
          color: var(--el-color-success);
        }
      }
    }

    .desc {
      margin-bottom: 24px;
      font-size: 13px;
      line-height: 1.5;
      color: var(--el-text-color-secondary);
    }

    .stats-row {
      display: flex;
      justify-content: space-between;

      .stat-item {
        .num {
          margin-bottom: 4px;
          font-family: "DIN Alternate", sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }

        .label {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }
}
</style>
