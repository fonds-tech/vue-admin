<template>
  <div v-if="show" class="fd-sidebar">
    <fd-vertical-menu />
  </div>
</template>

<script setup lang="ts">
import FdVerticalMenu from "../fd-vertical-menu/index.tsx"
import { computed } from "vue"

defineOptions({ name: "fd-sidebar" })

const show = computed(() => true)
</script>

<style lang="scss">
.fd-sidebar {
  height: 100vh;
  display: flex;
  flex-shrink: 0;
  user-select: none;
  flex-direction: column;
  &::before {
    top: 0;
    left: 0;
    width: 1px;
    height: 100%;
    content: "";
    position: absolute;
    background-color: var(--el-border-color);
  }
}
</style>
