<template>
  <svg class="svg-icon" :class="svgClass" :style="iconStyle" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue"
import { computed } from "vue"

defineOptions({ name: "svg-icon" })

const props = withDefaults(defineProps<Props>(), {
  prefix: "icon",
})

interface Props {
  /** 图标名称（对应 src/assets/svg 下的文件名，不含 .svg 后缀） */
  name: string
  /** 图标前缀，默认 icon */
  prefix?: string
  /** 图标大小 */
  size?: number | string
  /** 图标颜色 */
  color?: string
  /** 额外的 CSS 类名 */
  className?: string
}

/** 组合的 symbol id */
const symbolId = computed(() => `#${props.prefix}-${props.name}`)

/** 组合的 CSS 类名 */
const svgClass = computed(() => {
  return props.className ? `svg-icon--${props.name} ${props.className}` : `svg-icon--${props.name}`
})

/** 图标样式 */
const iconStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {}
  const size = typeof props.size === "number" ? `${props.size}px` : props.size

  if (size) {
    style.width = size
    style.height = size
  }
  if (props.color) {
    style.color = props.color
  }

  return style
})
</script>

<style lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: -0.15em;
  fill: currentcolor;
}
</style>
