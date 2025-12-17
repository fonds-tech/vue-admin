<template>
  <el-card shadow="hover" class="chart-card">
    <template #header>
      <div class="card-header">
        <span class="title">访问量</span>
        <span class="subtitle">今年增长 <span class="highlight">+15%</span></span>
      </div>
    </template>
    <div ref="chartRef" style="width: 100%; height: 350px;"></div>
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
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
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
          name: "访问量",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: [50, 28, 40, 20, 70, 35, 65, 30, 35, 18, 40, 45],
          lineStyle: {
            width: 3,
            color: "#409EFF",
          },
          itemStyle: {
            color: "#409EFF",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(64,158,255,0.2)" },
              { offset: 1, color: "rgba(64,158,255,0)" },
            ]),
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
    padding: 16px 24px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-card__body) {
    padding: 24px;
  }

  .card-header {
    display: flex;
    flex-direction: column;

    .title {
      margin-bottom: 4px;
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .subtitle {
      font-size: 13px;
      color: var(--el-text-color-secondary);

      .highlight {
        font-weight: 500;
        color: var(--el-color-success);
      }
    }
  }
}
</style>
