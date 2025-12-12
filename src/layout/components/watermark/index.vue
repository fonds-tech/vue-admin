<template>
  <div v-if="visible" class="watermark">
    <div class="watermark-content">
      <span v-for="i in 50" :key="i" class="watermark-text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 水印组件
 * 在页面上显示重复的水印文字
 */
import { computed } from "vue"
import { useAppStore } from "@/stores/app"
import { useUserStore } from "@/stores/user"

const appStore = useAppStore()
const userStore = useUserStore()

/** 是否显示水印 */
const visible = computed(() => appStore.showWatermark)

/** 水印文字（使用用户名） */
const text = computed(() => userStore.userInfo.nickname || "Admin")
</script>

<style lang="scss" scoped>
.watermark {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  z-index: 9999;
  overflow: hidden;
  position: fixed;
  user-select: none;
  pointer-events: none;

  &-content {
    display: flex;
    flex-wrap: wrap;
    transform: rotate(-25deg) translateY(-50%);
  }

  &-text {
    color: $text-secondary;
    width: 200px;
    display: inline-block;
    padding: 40px;
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
  }
}
</style>
