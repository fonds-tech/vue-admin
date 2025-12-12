<template>
  <icon v-if="isIconify" :icon="icon as string" :style="iconStyle" :horizontal-flip="hFlip" :vertical-flip="vFlip" :rotate="rotate" v-bind="$attrs" />
  <component :is="icon" v-else :style="iconStyle" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue"

interface Props {
  /** 图标名称，Iconify 格式如 "mdi:home" 或 Element Plus 图标组件 */
  icon: string | object
  /** 图标尺寸，可以是数字（px）或字符串（如 "1.5em"） */
  size?: number | string
  /** 图标颜色 */
  color?: string
  /** 水平翻转 */
  hFlip?: boolean
  /** 垂直翻转 */
  vFlip?: boolean
  /** 旋转角度：0=0deg, 1=90deg, 2=180deg, 3=270deg */
  rotate?: 0 | 1 | 2 | 3
}

const props = withDefaults(defineProps<Props>(), {
  size: "1em",
  color: "currentColor",
  hFlip: false,
  vFlip: false,
  rotate: 0,
})

/** 判断是否为 Iconify 图标（字符串格式且包含冒号） */
const isIconify = computed(() => {
  return typeof props.icon === "string" && props.icon.includes(":")
})

/** 计算图标样式 */
const iconStyle = computed(() => {
  const size = typeof props.size === "number" ? `${props.size}px` : props.size
  return {
    fontSize: size,
    width: size,
    height: size,
    color: props.color,
  }
})
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: middle;
}
</style>
