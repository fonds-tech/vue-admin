<template>
  <div class="fd-header">
    <div class="fd-header__left">
      <!-- 移动端显示菜单按钮 -->
      <div v-if="isMobile" class="fd-header__action-btn" @click="handleOpenMobileMenu">
        <fd-icon icon="ri:menu-line" :size="20" />
      </div>
      <!-- 非移动端且非水平布局显示折叠按钮 -->
      <div v-else-if="showCollapse" class="fd-header__action-btn" @click="handleToggleCollapse">
        <fd-icon :icon="collapseIcon" :size="20" />
      </div>
      <fd-breadcrumb />
    </div>
    <div class="fd-header__right">
      <!-- 搜索按钮 -->
      <div class="fd-header__action-btn" @click="handleOpenSearch">
        <fd-icon icon="ri:search-line" :size="20" />
      </div>
      <!-- 主题切换按钮 -->
      <div class="fd-header__action-btn" @click="handleToggleTheme">
        <fd-icon :icon="themeIcon" :size="20" />
      </div>
      <!-- 全屏按钮 -->
      <div class="fd-header__action-btn" @click="handleToggleFullscreen">
        <fd-icon :icon="fullscreenIcon" :size="20" />
      </div>
      <!-- 多语言切换 -->
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
      <!-- 设置按钮 -->
      <div class="fd-header__action-btn" @click="handleOpenSettings">
        <fd-icon icon="ri:settings-3-line" :size="20" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LanguageType } from "@/stores"
import fdBreadcrumb from "../fd-breadcrumb"
import { useMitt } from "@/hooks"
import { useDeviceStore, useSettingsStore } from "@/stores"
import { ref, inject, computed, onMounted, onUnmounted } from "vue"

defineOptions({ name: "fd-header" })

const mitt = useMitt("layout")

const deviceStore = useDeviceStore()
const settingsStore = useSettingsStore()

// ===================== 移动端菜单 =====================
/** 打开移动端菜单（由父组件注入） */
const openMobileMenu = inject<() => void>("openMobileMenu")

/** 打开移动端菜单 */
function handleOpenMobileMenu() {
  openMobileMenu?.()
}

/** 是否为移动端 */
const isMobile = computed(() => deviceStore.isMobile)

/** 是否为垂直布局 */
const isVerticalLayout = computed(() => settingsStore.isVerticalLayout)

/** 是否显示折叠按钮（非移动端且垂直布局） */
const showCollapse = computed(() => !isMobile.value && isVerticalLayout.value)

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
  }
  else {
    document.exitFullscreen()
  }
}

/** 监听全屏状态变化 */
function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

/** 打开搜索面板 */
function handleOpenSearch() {
  mitt.emit("search:open")
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
