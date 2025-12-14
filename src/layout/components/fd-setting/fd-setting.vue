<template>
  <el-drawer v-model="visible" title="系统设置" direction="rtl" size="320px" :show-close="true" :close-on-click-modal="true" class="fd-setting">
    <div class="fd-setting__content">
      <!-- 主题模式 -->
      <div class="fd-setting__section">
        <div class="fd-setting__title">主题模式</div>
        <div class="fd-setting__options">
          <div class="fd-setting__theme-option" :class="{ 'is-active': theme === 'light' }" @click="setTheme('light', $event)">
            <el-icon :size="24"><Sunny /></el-icon>
            <span>亮色</span>
          </div>
          <div class="fd-setting__theme-option" :class="{ 'is-active': theme === 'dark' }" @click="setTheme('dark', $event)">
            <el-icon :size="24"><Moon /></el-icon>
            <span>暗色</span>
          </div>
        </div>
      </div>

      <!-- 主题色 -->
      <div class="fd-setting__section">
        <div class="fd-setting__title">主题色</div>
        <div class="fd-setting__colors">
          <div
            v-for="color in themeColors"
            :key="color"
            class="fd-setting__color-option"
            :style="{ backgroundColor: color }"
            :class="{ 'is-active': primaryColor === color }"
            @click="setPrimaryColor(color)"
          >
            <el-icon v-if="primaryColor === color" :size="14"><Check /></el-icon>
          </div>
        </div>
      </div>

      <!-- 界面设置 -->
      <div class="fd-setting__section">
        <div class="fd-setting__title">界面设置</div>
        <div class="fd-setting__items">
          <div class="fd-setting__item">
            <span>显示标签栏</span>
            <el-switch v-model="showProcess" />
          </div>
          <div class="fd-setting__item">
            <span>固定顶栏</span>
            <el-switch v-model="fixedHeader" />
          </div>
          <div class="fd-setting__item">
            <span>显示水印</span>
            <el-switch v-model="showWatermark" />
          </div>
        </div>
      </div>

      <!-- 菜单设置 -->
      <div class="fd-setting__section">
        <div class="fd-setting__title">菜单设置</div>
        <div class="fd-setting__items">
          <div class="fd-setting__item">
            <span>菜单模式</span>
            <el-select v-model="menuMode" class="fd-setting__select--sm">
              <el-option value="accordion" label="手风琴" />
              <el-option value="expand" label="全部展开" />
              <el-option value="collapse" label="全部折叠" />
            </el-select>
          </div>
        </div>
      </div>

      <!-- 动画设置 -->
      <div class="fd-setting__section">
        <div class="fd-setting__title">过渡动画</div>
        <el-select v-model="transition" class="fd-setting__select">
          <el-option value="fade" label="淡入淡出" />
          <el-option value="slide" label="滑动" />
          <el-option value="zoom" label="缩放" />
          <el-option value="none" label="无动画" />
        </el-select>
      </div>

      <!-- 语言设置 -->
      <div class="fd-setting__section">
        <div class="fd-setting__title">语言设置</div>
        <el-select v-model="language" class="fd-setting__select" @change="changeLanguage">
          <el-option value="zh-CN" label="简体中文" />
          <el-option value="en-US" label="English" />
        </el-select>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import type { MenuMode, LanguageType, TransitionName } from "@/stores/settings/types"
import { computed } from "vue"
import { useSettingsStore } from "@/stores/settings"

defineOptions({ name: "fd-setting" })

const settingsStore = useSettingsStore()

/** 抽屉可见状态 - 与 store 同步 */
const visible = computed({
  get: () => settingsStore.settingsDrawerOpened,
  set: (val) => (val ? settingsStore.openSettingsDrawer() : settingsStore.closeSettingsDrawer()),
})

/** 预设主题色列表 */
const themeColors = [
  "#6366f1", // 靛蓝
  "#8b5cf6", // 紫色
  "#ec4899", // 粉色
  "#ef4444", // 红色
  "#f97316", // 橙色
  "#eab308", // 黄色
  "#22c55e", // 绿色
  "#14b8a6", // 青色
  "#0ea5e9", // 蓝色
]

/** 当前主题 */
const theme = computed(() => settingsStore.themeStyle)

/** 当前主题色 */
const primaryColor = computed({
  get: () => settingsStore.primaryColor,
  set: (val) => settingsStore.setPrimaryColor(val),
})

/** 显示标签栏 */
const showProcess = computed({
  get: () => settingsStore.showProcess,
  set: (val) => settingsStore.setShowProcess(val),
})

/** 固定顶栏 */
const fixedHeader = computed({
  get: () => settingsStore.fixedHeader,
  set: (val) => settingsStore.setFixedHeader(val),
})

/** 显示水印 */
const showWatermark = computed({
  get: () => settingsStore.showWatermark,
  set: (val) => settingsStore.setShowWatermark(val),
})

/** 菜单模式 */
const menuMode = computed({
  get: () => settingsStore.menuMode,
  set: (val) => settingsStore.setMenuMode(val as MenuMode),
})

/** 过渡动画 */
const transition = computed({
  get: () => settingsStore.transition,
  set: (val) => settingsStore.setTransition(val as TransitionName),
})

/** 当前语言 */
const language = computed({
  get: () => settingsStore.language,
  set: (val) => settingsStore.setLanguage(val as LanguageType),
})

/** 设置主题 */
function setTheme(mode: "light" | "dark", _event: MouseEvent) {
  settingsStore.setTheme(mode)
}

/** 设置主题色 */
function setPrimaryColor(color: string) {
  settingsStore.setPrimaryColor(color)
}

/** 切换语言 */
function changeLanguage() {
  window.location.reload()
}
</script>

<style lang="scss" scoped>
.fd-setting {
  &__content {
    gap: $spacing-lg;
    display: flex;
    flex-direction: column;
  }

  &__section {
    gap: $spacing-sm;
    display: flex;
    flex-direction: column;
  }

  &__title {
    color: $text-primary;
    font-size: 14px;
    font-weight: 600;
  }

  &__options {
    gap: $spacing-base;
    display: flex;
  }

  &__theme-option {
    gap: $spacing-xs;
    flex: 1;
    border: 2px solid $border-color;
    cursor: pointer;
    display: flex;
    padding: $spacing-base;
    transition: all $transition-duration;
    align-items: center;
    border-radius: $border-radius;
    flex-direction: column;
    justify-content: center;

    &:hover {
      border-color: $primary-color;
    }

    &.is-active {
      color: $primary-color;
      border-color: $primary-color;
      background-color: var(--el-color-primary-light-9);
    }

    span {
      font-size: 12px;
    }
  }

  &__colors {
    gap: $spacing-sm;
    display: flex;
    flex-wrap: wrap;
  }

  &__color-option {
    width: 28px;
    cursor: pointer;
    height: 28px;
    display: flex;
    transition: all $transition-duration;
    align-items: center;
    border-radius: 50%;
    justify-content: center;

    &:hover {
      transform: scale(1.1);
    }

    &.is-active {
      box-shadow:
        0 0 0 2px #fff,
        0 0 0 4px currentColor;
    }

    .el-icon {
      color: #fff;
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
  }

  &__item {
    display: flex;
    padding: $spacing-sm 0;
    font-size: 14px;
    align-items: center;
    border-bottom: 1px solid $border-color;
    justify-content: space-between;

    &:last-child {
      border-bottom: none;
    }
  }

  &__select {
    width: 100%;
  }

  &__select--sm {
    width: 120px;
  }
}
</style>
