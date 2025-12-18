<template>
  <div class="fd-view">
    <router-view v-slot="{ Component, route }">
      <transition :name="transitionName" mode="out-in">
        <keep-alive :key="key" :include="cacheList">
          <el-scrollbar>
            <component :is="Component" :key="route.path" />
          </el-scrollbar>
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useMitt } from "@/hooks"
import { ref, computed, onUnmounted } from "vue"
import { useProcessStore, useSettingsStore } from "@/stores"

defineOptions({ name: "fd-view" })

const mitt = useMitt("layout")
const processStore = useProcessStore()
const settingsStore = useSettingsStore()

const key = ref(1)

/** 缓存列表 */
const cacheList = computed(() => processStore.cacheList)

/** 过渡动画名称 */
const transitionName = computed(() => {
  // 如果设置为 none，则不使用过渡动画
  if (settingsStore.transition === "none") return ""
  return settingsStore.transition
})

/**
 * 处理页面刷新
 * 通过临时移除组件实现刷新效果
 */
function handleRefresh() {
  key.value += 1
}

onBeforeMount(() => {
  mitt.on("process:refresh", handleRefresh)
})

onUnmounted(() => {
  mitt.off("process:refresh", handleRefresh)
})
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

// 淡入淡出过渡
.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-duration;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 滑动过渡
.slide-enter-active,
.slide-leave-active {
  transition: all $transition-duration;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

// 缩放过渡
.zoom-enter-active,
.zoom-leave-active {
  transition: all $transition-duration;
}

.zoom-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.zoom-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
