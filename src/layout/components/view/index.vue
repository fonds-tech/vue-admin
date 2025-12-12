<template>
  <main class="layout-view">
    <router-view v-slot="{ Component, route }">
      <transition name="fade" mode="out-in">
        <keep-alive :include="cacheList">
          <component :is="Component" v-if="!isRefreshing" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>

<script setup lang="ts">
/**
 * 视图出口组件
 * 封装 router-view + keep-alive + transition
 */
import { emitter } from "@/utils/mitt"
import { useProcessStore } from "@/stores"
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue"

defineOptions({ name: "layout-view" })

const processStore = useProcessStore()

/** 是否正在刷新（用于 keep-alive 刷新） */
const isRefreshing = ref(false)

/** 缓存列表 */
const cacheList = computed(() => processStore.cacheList)

/**
 * 处理页面刷新
 * 通过临时移除组件实现刷新效果
 */
function handleRefresh() {
  isRefreshing.value = true
  nextTick(() => {
    isRefreshing.value = false
  })
}

onMounted(() => {
  emitter.on("process:refresh", handleRefresh)
})

onUnmounted(() => {
  emitter.off("process:refresh", handleRefresh)
})
</script>

<style lang="scss" scoped>
.layout-view {
  flex: 1;
  padding: $spacing-base;
  background-color: $bg-page;
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
</style>
