<template>
  <div class="logo" @click="handleGoHome">
    <img src="@/assets/logo.svg" alt="logo" class="img" />
    <h1 v-show="!collapsed" class="title">{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

defineOptions({ name: "logo" })

defineProps<{ collapsed?: boolean }>()

const router = useRouter()

const title = import.meta.env.VITE_APP_TITLE

function handleGoHome() {
  router.push("/")
}
</script>

<style lang="scss" scoped>
.logo {
  gap: $spacing-md;
  cursor: pointer;
  height: $header-height;
  display: flex;
  align-items: center;
  justify-content: center;

  .img {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  .title {
    overflow: hidden;
    font-size: 18px;
    background: linear-gradient(135deg, $primary-color 0%, #8b5cf6 100%);
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
