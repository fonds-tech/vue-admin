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
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  height: 100vh;
  user-select: none;

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    content: "";
    background-color: var(--el-border-color);
  }
}
</style>
