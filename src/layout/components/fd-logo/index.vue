<template>
  <div class="fd-logo" @click="handleGoHome">
    <img src="@/assets/logo.svg" alt="logo" class="fd-logo__img" />
    <h1 v-if="showTitle" class="fd-logo__title">{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

defineOptions({ name: "fd-logo" })

defineProps<{
  /** 是否显示标题 */
  showTitle?: boolean
}>()

const router = useRouter()
const title = import.meta.env.VITE_APP_TITLE

function handleGoHome() {
  router.push("/")
}
</script>

<style lang="scss" scoped>
.fd-logo {
  gap: 12px;
  cursor: pointer;
  height: $header-height;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;

  &__img {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  &__title {
    color: var(--el-text-color-primary);
    overflow: hidden;
    font-size: 18px;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
