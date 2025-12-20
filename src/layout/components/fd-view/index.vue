<template>
  <div class="fd-view">
    <router-view v-slot="{ Component, route }">
      <keep-alive :key="key" :include="cacheList">
        <el-scrollbar>
          <transition :name="transitionName" :css="transitionEnabled" :mode="transitionEnabled ? 'out-in' : undefined">
            <component :is="Component" :key="route.path" />
          </transition>
        </el-scrollbar>
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useMitt } from "@/hooks"
import { useProcessStore, useSettingsStore } from "@/stores"
import { ref, computed, onUnmounted, onBeforeMount } from "vue"

defineOptions({ name: "fd-view" })

const mitt = useMitt("layout")
const processStore = useProcessStore()
const settingsStore = useSettingsStore()

const key = ref(1)

/** 缓存列表 */
const cacheList = computed(() => processStore.cacheList)

/** 过渡动画名称 */
const transitionName = computed(() => (settingsStore.transition === "none" ? "" : `page-${settingsStore.transition}`))

/** 是否启用过渡动画 */
const transitionEnabled = computed(() => settingsStore.transition !== "none")

onBeforeMount(() => {
  mitt.on("process:refresh", handleRefresh)
})

onUnmounted(() => {
  mitt.off("process:refresh", handleRefresh)
})

/**
 * 处理页面刷新
 * 通过临时移除组件实现刷新效果
 */
function handleRefresh() {
  key.value += 1
}
</script>

<style lang="scss">
.fd-view {
  flex: 1;
  overflow: hidden;
  background-color: var(--el-fill-color-lighter);

  .el-scrollbar__view {
    display: flex;
    padding: 12px;
    overflow-x: hidden;
    flex-direction: column;
  }
}
</style>
