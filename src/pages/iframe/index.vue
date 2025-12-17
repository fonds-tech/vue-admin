<template>
  <div class="frame-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="frame-loading">
      <el-icon class="loading-icon" :size="32">
        <Loading />
      </el-icon>
      <span>正在加载 {{ frameTitle }}...</span>
    </div>

    <!-- 无效链接提示 -->
    <div v-if="!frameSrc" class="frame-empty">
      <el-empty description="未指定页面地址" />
    </div>

    <!-- IFrame 内容 -->
    <iframe v-else ref="iframeRef" :src="frameSrc" :title="frameTitle" class="frame-iframe" frameborder="0" allowfullscreen @load="handleLoad" @error="handleError" />
  </div>
</template>

<script setup lang="ts">
/**
 * IFrame 内嵌页面组件
 * 用于在系统内嵌入外部网页
 */
import { useRoute } from "vue-router"
import { ref, watch, computed, onMounted } from "vue"

const route = useRoute()

const loading = ref(true)
const iframeRef = ref<HTMLIFrameElement | null>(null)

// 从路由 meta 或 query 中获取 iframe 地址
const frameSrc = computed(() => {
  return (route.meta.frameSrc as string) || (route.query.src as string) || ""
})

// 页面标题
const frameTitle = computed(() => {
  return (route.meta.title as string) || "外部页面"
})

// iframe 加载完成
function handleLoad() {
  loading.value = false
}

// iframe 加载失败
function handleError() {
  loading.value = false
}

// 监听路由变化，重新加载 iframe
watch(
  () => route.fullPath,
  () => {
    loading.value = true
  },
)

onMounted(() => {
  if (!frameSrc.value) {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.frame-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 120px);
  overflow: hidden;
}

.frame-loading {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: $text-secondary;
  background: $bg-page;

  .loading-icon {
    color: $primary-color;
    animation: rotate 1s linear infinite;
  }
}

.frame-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.frame-iframe {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 120px);
  border: none;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
