<template>
  <div class="fd-logo">
    <img src="@/assets/logo.svg" alt="logo" class="fd-logo__img" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: "fd-logo" })
</script>

<style lang="scss" scoped>
.fd-logo {
  cursor: pointer;
  display: flex;
  flex-shrink: 0;

  &__img {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }
}
</style>
