<template>
  <div class="workbench-container">
    <!-- 统计卡片 -->
    <el-row :gutter="12">
      <el-col v-for="(item, index) in statisticsData" :key="index" :xs="24" :sm="12" :md="6">
        <workbench-card
          :title="item.title"
          :number="item.number"
          :tag-text="item.tagText"
          :tag-type="item.tagType"
          :icon="item.icon"
          :desc="item.desc"
          :trend="item.trend"
          :trend-value="item.trendValue"
        />
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="12">
      <el-col :xs="24" :lg="16">
        <workbench-line-chart />
      </el-col>
      <el-col :xs="24" :lg="8">
        <workbench-bar-chart />
      </el-col>
    </el-row>

    <!-- 列表区域 -->
    <el-row :gutter="12">
      <el-col :xs="24" :lg="8">
        <workbench-table />
      </el-col>
      <el-col :xs="24" :lg="8">
        <workbench-activity />
      </el-col>
      <el-col :xs="24" :lg="8">
        <workbench-todo />
      </el-col>
    </el-row>

    <!-- 项目介绍 -->
    <el-row>
      <el-col :span="24">
        <workbench-project />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import WorkbenchCard from "./components/WorkbenchCard.vue"
import WorkbenchTodo from "./components/WorkbenchTodo.vue"
import WorkbenchTable from "./components/WorkbenchTable.vue"
import WorkbenchProject from "./components/WorkbenchProject.vue"
import WorkbenchActivity from "./components/WorkbenchActivity.vue"
import WorkbenchBarChart from "./components/WorkbenchBarChart.vue"
import WorkbenchLineChart from "./components/WorkbenchLineChart.vue"

const statisticsData = [
  {
    title: "总访问次数",
    number: "9120",
    tagText: "",
    tagType: "info" as const,
    icon: "Timer",
    desc: "较上周",
    trend: "up" as const,
    trendValue: "+20%",
  },
  {
    title: "在线访客数",
    number: "182",
    tagText: "",
    tagType: "info" as const,
    icon: "User",
    desc: "较上周",
    trend: "up" as const,
    trendValue: "+10%",
  },
  {
    title: "点击量",
    number: "9520",
    tagText: "",
    tagType: "info" as const,
    icon: "Pointer",
    desc: "较上周",
    trend: "down" as const,
    trendValue: "-12%",
  },
  {
    title: "新用户",
    number: "156",
    tagText: "",
    tagType: "info" as const,
    icon: "Plus",
    desc: "较上周",
    trend: "up" as const,
    trendValue: "+30%",
  },
]
</script>

<style scoped lang="scss">
.workbench-container {
  padding: 12px;
}
</style>
