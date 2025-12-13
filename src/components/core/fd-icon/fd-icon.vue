<template>
  <icon v-if="isIconify" :icon="icon as string" :style="iconStyle" :horizontal-flip="hFlip" :vertical-flip="vFlip" :rotate="rotate" v-bind="$attrs" />
  <component :is="icon" v-else :style="iconStyle" v-bind="$attrs" />
</template>

<script setup lang="ts">
import type { IconProps } from "./types"
import type { CSSProperties } from "vue"
import { Icon } from "@iconify/vue"
import { computed } from "vue"

defineOptions({
  name: "fd-icon",
})

const props = withDefaults(defineProps<IconProps>(), {
  size: "1em",
  color: "currentColor",
  hFlip: false,
  vFlip: false,
  rotate: 0,
})

/** 判断是否为 Iconify 图标（字符串格式且包含冒号） */
const isIconify = computed<boolean>(() => {
  return typeof props.icon === "string" && props.icon.includes(":")
})

/** 计算图标样式 */
const iconStyle = computed<CSSProperties>(() => {
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
