<template>
  <icon v-if="isIconify" class="fd-icon" :icon="icon as string" :style="iconStyle" :horizontal-flip="hFlip" :vertical-flip="vFlip" :rotate="rotate" v-bind="$attrs" />
  <component :is="icon" v-else class="fd-icon" :style="iconStyle" v-bind="$attrs" />
</template>

<script setup lang="ts">
import type { IconProps } from "./types"
import type { CSSProperties } from "vue"
import { Icon } from "@iconify/vue"
import { computed } from "vue"

defineOptions({
  name: "fd-icon",
  inheritAttrs: false,
})

const props = withDefaults(defineProps<IconProps>(), {
  hFlip: false,
  vFlip: false,
  rotate: 0,
})

/** 判断是否为 Iconify 图标（字符串格式且包含冒号） */
const isIconify = computed<boolean>(() => {
  return typeof props.icon === "string" && props.icon.includes(":")
})

/** 计算图标样式（只在用户传入自定义值时才设置，避免覆盖外部样式） */
const iconStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  const size = typeof props.size === "number" ? `${props.size}px` : props.size

  if (size) {
    style.fontSize = size
  }
  if (props.color) {
    style.color = props.color
  }

  return style
})
</script>

<style lang="scss">
.fd-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
  display: inline-block;
  font-size: inherit;
  flex-shrink: 0;
  vertical-align: middle;
}
</style>
