<!-- FdIcon 图标组件 -->
<template>
  <icon v-if="icon" :icon="icon" class="fd-icon" :class="[$attrs.class]" :style="iconStyle" :horizontal-flip="hFlip" :vertical-flip="vFlip" :rotate="rotate" />
</template>

<script setup lang="ts">
import type { IconProps } from "./types"
import type { CSSProperties } from "vue"
import { Icon } from "@iconify/vue"

defineOptions({ name: "fd-icon", inheritAttrs: false })

const props = withDefaults(defineProps<IconProps>(), { size: "" })

const attrs = useAttrs()

/** 合并样式 */
const iconStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}

  // 尺寸处理
  if (props.size) {
    const size = typeof props.size === "number" ? `${props.size}px` : props.size
    style.fontSize = size
  }

  // 颜色
  if (props.color) {
    style.color = props.color
  }

  // 合并外部传入的 style
  if (attrs.style) {
    Object.assign(style, attrs.style)
  }

  return style
})
</script>

<style scoped>
.fd-icon {
  display: inline;
  flex-shrink: 0;
}
</style>
