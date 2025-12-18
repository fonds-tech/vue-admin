<template>
  <div class="chart-card">
    <div class="card-header">
      <div class="header-left">
        <h3 class="title">数据趋势</h3>
        <p class="subtitle">最近 12 个月的访问量与订单统计</p>
      </div>
      <div class="header-right">
        <el-radio-group v-model="timeRange" size="small">
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
          <el-radio-button label="year">全年</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div ref="chartRef" class="chart-content"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue"
import * as echarts from "echarts"

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null
const timeRange = ref("year")

function setOptions() {
  const option = {
    grid: {
      left: "2%",
      right: "2%",
      bottom: "2%",
      top: "15%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      borderColor: "#e4e7ed",
      textStyle: {
        color: "#606266",
      },
    },
    legend: {
      data: ["访问量", "订单数"],
      right: 10,
      top: 0,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: "#909399",
      },
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
        data: [120, 132, 101, 134, 90, 230, 210, 180, 200, 250, 220, 280],
        lineStyle: {
          width: 4,
          color: "#4f46e5",
          shadowColor: "rgba(79, 70, 229, 0.3)",
          shadowBlur: 10,
        },
        itemStyle: {
          color: "#4f46e5",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(79, 70, 229, 0.2)" },
            { offset: 1, color: "rgba(79, 70, 229, 0)" },
          ]),
        },
      },
      {
        name: "订单数",
        type: "line",
        smooth: true,
        showSymbol: false,
        data: [220, 182, 191, 234, 290, 330, 310, 320, 300, 340, 360, 380],
        lineStyle: {
          width: 4,
          color: "#10b981",
          shadowColor: "rgba(16, 185, 129, 0.3)",
          shadowBlur: 10,
        },
        itemStyle: {
          color: "#10b981",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(16, 185, 129, 0.2)" },
            { offset: 1, color: "rgba(16, 185, 129, 0)" },
          ]),
        },
      },
    ],
  }
  chartInstance?.setOption(option)
}

function initChart() {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value)
    setOptions()
  }
}

function resizeChart() {
  chartInstance?.resize()
}

watch(timeRange, () => {
  // Mock data update
  if (!chartInstance) return

  // Just animate to new random data for demo
  const r = () => Math.floor(Math.random() * 300) + 50
  chartInstance.setOption({
    series: [{ data: Array.from({ length: 12 }, r) }, { data: Array.from({ length: 12 }, r) }],
  })
})

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
  border: 1px solid var(--el-border-color-lighter);
  height: 100%;
  padding: 24px;
  background: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
  transition: all 0.3s ease;
  border-radius: 12px;

  &:hover {
    box-shadow: 0 12px 24px -8px rgb(0 0 0 / 8%);
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    justify-content: space-between;

    .title {
      color: var(--el-text-color-primary);
      margin: 0 0 4px;
      font-size: 18px;
      font-weight: 600;
    }

    .subtitle {
      color: var(--el-text-color-secondary);
      margin: 0;
      font-size: 13px;
    }
  }

  .chart-content {
    width: 100%;
    height: 350px;
  }
}
</style>
