<template>
  <header class="header">
    <div class="header-left">
      <!-- 折叠按钮 -->
      <el-icon class="collapse-btn" @click="toggleSidebar">
        <Fold v-if="!appStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>

      <!-- 面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">{{ $t("menu.dashboard") }}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.meta.title && $route.path !== '/dashboard'">
          {{ $route.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="header-right">
      <!-- 主题切换 -->
      <el-tooltip :content="appStore.theme === 'light' ? '暗色模式' : '亮色模式'">
        <el-icon class="header-action" @click="toggleTheme">
          <Moon v-if="appStore.theme === 'light'" />
          <Sunny v-else />
        </el-icon>
      </el-tooltip>

      <!-- 语言切换 -->
      <el-dropdown @command="changeLanguage">
        <el-icon class="header-action">
          <i-ep-document />
        </el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
            <el-dropdown-item command="en-US">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- 全屏 -->
      <el-tooltip content="全屏">
        <el-icon class="header-action" @click="toggleFullscreen">
          <FullScreen />
        </el-icon>
      </el-tooltip>

      <!-- 用户信息 -->
      <el-dropdown>
        <div class="user-info">
          <el-avatar :size="28" :src="userStore.userInfo.avatar || ''">
            {{ userStore.userInfo.nickname?.charAt(0) || "A" }}
          </el-avatar>
          <span class="user-name">{{ userStore.userInfo.nickname || "管理员" }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>{{ $t("header.profile") }}</el-dropdown-item>
            <el-dropdown-item>{{ $t("header.settings") }}</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              {{ $t("header.logout") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * 顶栏组件
 */
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { useAppStore } from "@/stores/app"
import { useUserStore } from "@/stores/user"
import { ElMessageBox } from "element-plus"

const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()
const userStore = useUserStore()

function toggleSidebar() {
  appStore.toggleSidebar()
}

function toggleTheme() {
  appStore.toggleTheme()
}

function changeLanguage(lang: string) {
  appStore.setLanguage(lang)
  window.location.reload()
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
  else {
    document.documentElement.requestFullscreen()
  }
}

async function handleLogout() {
  try {
    await ElMessageBox.confirm(t("header.logoutConfirm"), t("common.confirm"), {
      type: "warning",
    })
    userStore.logout()
    router.push("/login")
  }
  catch {
    // 用户取消
  }
}
</script>

<style lang="scss" scoped>
.header {
  top: 0;
  height: $header-height;
  display: flex;
  padding: 0 $spacing-base;
  z-index: $z-index-sticky;
  position: sticky;
  box-shadow: $shadow;
  align-items: center;
  justify-content: space-between;
  background-color: $bg-white;

  &-left {
    gap: $spacing-base;
    display: flex;
    align-items: center;
  }

  &-right {
    gap: $spacing-sm;
    display: flex;
    align-items: center;
  }

  .collapse-btn {
    cursor: pointer;
    font-size: 20px;
    transition: color $transition-duration;

    &:hover {
      color: $primary-color;
    }
  }

  &-action {
    width: 36px;
    cursor: pointer;
    height: 36px;
    display: flex;
    font-size: 18px;
    transition: background-color $transition-duration;
    align-items: center;
    border-radius: $border-radius;
    justify-content: center;

    &:hover {
      background-color: $bg-color;
    }
  }

  .user-info {
    gap: $spacing-sm;
    cursor: pointer;
    display: flex;
    padding: 4px 8px;
    transition: background-color $transition-duration;
    align-items: center;
    border-radius: $border-radius;

    &:hover {
      background-color: $bg-color;
    }

    .user-name {
      overflow: hidden;
      font-size: 14px;
      max-width: 100px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
