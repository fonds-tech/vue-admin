<template>
  <div class="fd-view">
    <router-view v-slot="{ Component, route }">
      <keep-alive :key="key" :include="cacheList">
        <el-scrollbar>
          <component :is="Component" :key="route.path" />
        </el-scrollbar>
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useMitt } from "@/hooks"
import { useProcessStore } from "@/stores"
import { ref, computed, onUnmounted } from "vue"

defineOptions({ name: "fd-view" })

const mitt = useMitt("layout")
const processStore = useProcessStore()

const key = ref(1)

/** 缓存列表 */
const cacheList = computed(() => processStore.cacheList)

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
</style>
