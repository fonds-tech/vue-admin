<template>
  <h1 class="fd-name">{{ appTitle }}</h1>
</template>

<script setup lang="ts">
defineOptions({ name: "fd-name" })

const appTitle = import.meta.env.VITE_APP_TITLE
</script>

<style lang="scss" scoped>
.fd-name {
  color: var(--el-text-color-primary);
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
