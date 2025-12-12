<template>
  <div class="layout">
    <el-container>
      <sidebar />
      <el-container>
        <layout-header :class="{ 'is-fixed': appStore.fixedHeader }" @open-settings="settingsVisible = true" />
        <layout-process v-if="appStore.showProcess" />
        <layout-view />
      </el-container>
    </el-container>

    <!-- 水印 -->
    <layout-watermark />

    <!-- 设置抽屉 -->
    <layout-settings v-model="settingsVisible" />
  </div>
</template>

<script setup lang="ts">
import Sidebar from "./components/sidebar/index.vue"
import LayoutView from "./components/view/index.vue"
import LayoutHeader from "./components/header/index.vue"
import LayoutProcess from "./components/process/index.vue"
import LayoutSettings from "./components/settings/index.vue"
import LayoutWatermark from "./components/watermark/index.vue"
import { ref } from "vue"
import { useAppStore } from "@/stores"
import { ElContainer } from "element-plus"

const appStore = useAppStore()

/** 设置抽屉是否可见 */
const settingsVisible = ref(false)
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  min-height: 100vh;
}
</style>
