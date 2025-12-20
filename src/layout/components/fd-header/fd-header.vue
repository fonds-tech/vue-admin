<template>
  <div class="fd-header">
    <div class="fd-header__left">
      <div v-if="isMobile" class="fd-header__action-btn" @click="handleOpenMobileMenu">
        <fd-icon icon="ri:menu-line" :size="20" />
      </div>
      <template v-else-if="isHorizontalLayout">
        <div class="fd-header__logo">
          <fd-logo />
          <fd-name />
        </div>
      </template>
      <div v-else-if="showCollapse" class="fd-header__action-btn" @click="handleToggleCollapse">
        <fd-icon :icon="collapseIcon" :size="20" />
      </div>
      <fd-breadcrumb />
      <fd-horizontal-menu />
    </div>
    <div class="fd-header__right">
      <div class="fd-header__action-btn" @click="handleOpenSearch">
        <fd-icon icon="ri:search-line" :size="20" />
      </div>
      <div class="fd-header__action-btn" @click="handleToggleTheme">
        <fd-icon :icon="themeIcon" :size="20" />
      </div>
      <div class="fd-header__action-btn" @click="handleToggleFullscreen">
        <fd-icon :icon="fullscreenIcon" :size="20" />
      </div>
      <el-dropdown trigger="hover" @command="handleChangeLanguage">
        <div class="fd-header__action-btn">
          <fd-icon icon="ri:translate-2" :size="20" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN" :class="{ 'is-active': currentLang === 'zh-CN' }">
              简体中文
            </el-dropdown-item>
            <el-dropdown-item command="en-US" :class="{ 'is-active': currentLang === 'en-US' }">
              English
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="fd-header__action-btn" @click="handleOpenSettings">
        <fd-icon icon="ri:settings-3-line" :size="20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LanguageType } from "@/stores"
import FdLogo from "../fd-logo/index.vue"
import FdName from "../fd-name/index.vue"
import FdBreadcrumb from "../fd-breadcrumb"
import FdHorizontalMenu from "../fd-horizontal-menu"
import { useMitt } from "@/hooks"
import { useDeviceStore, useSettingsStore } from "@/stores"

import { ref, computed, onMounted, onUnmounted } from "vue"

defineOptions({ name: "fd-header" })

const mitt = useMitt("layout")

const deviceStore = useDeviceStore()
const settingsStore = useSettingsStore()

const isFullscreen = ref(false)

const isMobile = computed(() => deviceStore.isMobile)

const isVerticalLayout = computed(() => settingsStore.isVerticalLayout)

const isHorizontalLayout = computed(() => settingsStore.isHorizontalLayout)

const isMixedLayout = computed(() => settingsStore.isMixedLayout)

/** 显示折叠按钮（垂直布局或混合布局下显示） */
const showCollapse = computed(() => !isMobile.value && (isVerticalLayout.value || isMixedLayout.value))

const collapseIcon = computed(() => {
  return settingsStore.isMenuCollapsed ? "ri:menu-unfold-line" : "ri:menu-fold-line"
})

const currentLang = computed(() => settingsStore.language)

const isDarkTheme = computed(() => settingsStore.isThemeDark)

const themeIcon = computed(() => {
  return isDarkTheme.value ? "ri:sun-line" : "ri:moon-line"
})

const fullscreenIcon = computed(() => {
  return isFullscreen.value ? "ri:fullscreen-exit-line" : "ri:fullscreen-line"
})

onMounted(() => {
  document.addEventListener("fullscreenchange", handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange)
})

function handleToggleCollapse() {
  settingsStore.toggleMenuCollapsed()
}

function handleChangeLanguage(lang: string) {
  if (lang !== currentLang.value) {
    settingsStore.setLanguage(lang as LanguageType)
    window.location.reload()
  }
}

function handleToggleTheme(event: MouseEvent) {
  settingsStore.toggleTheme({
    x: event.clientX,
    y: event.clientY,
  })
}

function handleToggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

function handleOpenSearch() {
  mitt.emit("search:open")
}

function handleOpenMobileMenu() {
  mitt.emit("mobile-menu:open")
}

function handleOpenSettings() {
  settingsStore.openSettingsDrawer()
}
</script>

<style lang="scss" scoped>
.fd-header {
  height: 50px;
  display: flex;
  padding: 0 12px;
  position: relative;
  align-items: center;
  flex-shrink: 0;
  justify-content: space-between;

  &::before {
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    content: "";
    position: absolute;
    background-color: var(--el-border-color-extra-light);
  }

  &__left {
    gap: 12px;
    flex: 1;
    display: flex;
    overflow: hidden;
    align-items: center;
  }

  &__right {
    gap: 12px;
    display: flex;
    align-items: center;
  }

  &__logo {
    gap: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  &__action-btn {
    width: 30px;
    border: 1px solid var(--el-fill-color-dark);
    cursor: pointer;
    height: 30px;
    display: flex;
    transition: all 0.2s ease-in-out;
    align-items: center;
    border-radius: 6px;
    justify-content: center;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-fill-color-dark);
    }
  }
}
</style>
