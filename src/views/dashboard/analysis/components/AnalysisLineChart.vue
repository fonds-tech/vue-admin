<template>
  <el-card shadow="hover" class="chart-card">
    <template #header>
      <div class="card-header">
        <span>访问趋势</span>
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
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["访问量", "独立访客"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "访问量",
          type: "line",
          smooth: true,
          data: [120, 132, 101, 134, 90, 230, 210],
          itemStyle: {
            color: "#409EFF",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(64,158,255,0.3)" },
              { offset: 1, color: "rgba(64,158,255,0.1)" },
            ]),
          },
        },
        {
          name: "独立访客",
          type: "line",
          smooth: true,
          data: [220, 182, 191, 234, 290, 330, 310],
          itemStyle: {
            color: "#67C23A",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(103,194,58,0.3)" },
              { offset: 1, color: "rgba(103,194,58,0.1)" },
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

<style scoped>
.chart-card {
  margin-bottom: 20px;
}
</style>
