<template>
  <div class="sidebar-logo" @click="goHome">
    <img src="@/assets/logo.svg" alt="logo" class="logo-img" />
    <transition name="fade">
      <h1 v-show="!collapsed" class="logo-title">Vue Admin</h1>
    </transition>
  </div>
</template>

<script setup lang="ts">
/**
 * 侧边栏 Logo 组件
 * 支持折叠态和展开态显示
 */
import { useRouter } from "vue-router"

defineProps<{
  /** 是否折叠 */
  collapsed?: boolean
}>()

const router = useRouter()

/** 点击 Logo 跳转首页 */
function goHome() {
  router.push("/")
}
</script>

<style lang="scss" scoped>
.sidebar-logo {
  cursor: pointer;
  height: $header-height;
  display: flex;
  padding: 0 $spacing-base;
  transition: all $transition-duration $transition-timing;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.85;
  }

  .logo-img {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }

  .logo-title {
    color: #fff;
    overflow: hidden;
    font-size: 18px;
    font-weight: 600;
    margin-left: $spacing-sm;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

// 淡入淡出过渡
.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-duration;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
