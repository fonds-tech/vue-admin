<template>
  <h1 class="fd-name">{{ appTitle }}</h1>
</template>

<script setup lang="ts">
defineOptions({ name: "fd-name" })

const appTitle = import.meta.env.VITE_APP_TITLE
</script>

<style lang="scss" scoped>
.fd-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  white-space: nowrap;
}
</style>
