<template>
  <div class="fd-header-bar">
    <div class="fd-header-bar__left">
      <!-- 非水平布局显示折叠按钮和面包屑 -->
      <div v-if="isVerticalLayout" class="fd-header-bar__action-btn" @click="handleToggleCollapse">
        <fd-icon :icon="collapseIcon" :size="20" />
      </div>
      <fd-breadcrumb />
    </div>
    <div class="fd-header-bar__right">
      <!-- 主题切换按钮 -->
      <div class="fd-header-bar__action-btn" @click="handleToggleTheme">
        <fd-icon :icon="themeIcon" :size="20" />
      </div>
      <!-- 全屏按钮 -->
      <div class="fd-header-bar__action-btn" @click="handleToggleFullscreen">
        <fd-icon :icon="fullscreenIcon" :size="20" />
      </div>
      <!-- 多语言切换 -->
      <el-dropdown trigger="hover" @command="handleChangeLanguage">
        <div class="fd-header-bar__action-btn">
          <fd-icon icon="ri:translate-2" :size="20" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN" :class="{ 'is-active': currentLang === 'zh-CN' }"> 简体中文 </el-dropdown-item>
            <el-dropdown-item command="en-US" :class="{ 'is-active': currentLang === 'en-US' }"> English </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 设置按钮 -->
      <div class="fd-header-bar__action-btn" @click="handleOpenSettings">
        <fd-icon icon="ri:settings-3-line" :size="20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LanguageType } from "@/stores"
import { Icon as FdIcon } from "@/components/core/fd-icon"
import { useSettingsStore } from "@/stores"
import { Breadcrumb as FdBreadcrumb } from "../fd-breadcrumb"
import { ref, computed, onMounted, onUnmounted } from "vue"

defineOptions({ name: "fd-header-bar" })

const settingsStore = useSettingsStore()

// ===================== 布局判断 =====================

/** 是否为垂直布局 */
const isVerticalLayout = computed(() => settingsStore.isVerticalLayout)

// ===================== 折叠功能 =====================
/** 折叠图标 */
const collapseIcon = computed(() => {
  return settingsStore.isMenuCollapsed ? "ri:menu-unfold-line" : "ri:menu-fold-line"
})

/** 切换折叠状态 */
function handleToggleCollapse() {
  settingsStore.toggleMenuCollapsed()
}

// ===================== 多语言功能 =====================
/** 当前语言 */
const currentLang = computed(() => settingsStore.language)

/** 切换语言 */
function handleChangeLanguage(lang: string) {
  if (lang !== currentLang.value) {
    settingsStore.setLanguage(lang as LanguageType)
    window.location.reload()
  }
}

// ===================== 主题切换功能 =====================
/** 当前是否为暗色主题 */
const isDarkTheme = computed(() => settingsStore.isThemeDark)

/** 主题图标 */
const themeIcon = computed(() => {
  return isDarkTheme.value ? "ri:sun-line" : "ri:moon-line"
})

/** 切换主题（从点击位置开始动画） */
function handleToggleTheme(event: MouseEvent) {
  settingsStore.toggleTheme({
    x: event.clientX,
    y: event.clientY,
  })
}

// ===================== 全屏功能 =====================
/** 是否全屏状态 */
const isFullscreen = ref(false)

/** 全屏图标 */
const fullscreenIcon = computed(() => {
  return isFullscreen.value ? "ri:fullscreen-exit-line" : "ri:fullscreen-line"
})

/** 切换全屏状态 */
function handleToggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

/** 监听全屏状态变化 */
function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener("fullscreenchange", handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener("fullscreenchange", handleFullscreenChange)
})

// ===================== 设置功能 =====================
/** 打开设置面板 */
function handleOpenSettings() {
  settingsStore.openSettingsDrawer()
}
</script>

<style lang="scss">
.fd-header-bar {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 12px;

  &::before {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: "";
    background-color: var(--el-border-color-extra-light);
  }

  &__left {
    display: flex;
    flex: 1;
    gap: 12px;
    align-items: center;
    overflow: hidden;
  }

  &__right {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  &__action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    cursor: pointer;
    border: 1px solid var(--el-fill-color-dark);
    border-radius: 6px;
    transition: all 0.2s ease-in-out;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-fill-color-dark);
    }
  }
}
</style>
