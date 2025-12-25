<template>
  <el-drawer v-model="visible" title="系统设置" direction="rtl" size="320px" :show-close="true" :close-on-click-modal="true" class="fd-setting">
    <div class="fd-setting__content">
      <!-- 主题风格 -->
      <div class="fd-setting__section">
        <div class="fd-setting__title">主题风格</div>
        <div class="fd-setting__options">
          <div class="fd-setting__card" :class="{ 'is-active': theme === 'light' }" @click="setTheme('light', $event)">
            <div class="fd-setting__preview" v-html="themeLightSvg"></div>
            <span>浅色</span>
          </div>
          <div class="fd-setting__card" :class="{ 'is-active': theme === 'dark' }" @click="setTheme('dark', $event)">
            <div class="fd-setting__preview" v-html="themeDarkSvg"></div>
            <span>深色</span>
          </div>
          <div class="fd-setting__card" :class="{ 'is-active': theme === 'auto' }" @click="setTheme('auto', $event)">
            <div class="fd-setting__preview" v-html="themeSystemSvg"></div>
            <span>系统</span>
          </div>
        </div>
      </div>

      <!-- 菜单布局 -->
      <div class="fd-setting__section">
        <div class="fd-setting__title">菜单布局</div>
        <div class="fd-setting__options">
          <div class="fd-setting__card" :class="{ 'is-active': menuLayout === 'vertical' }" @click="menuLayout = 'vertical'">
            <div class="fd-setting__preview" v-html="layoutVerticalSvg"></div>
            <span>垂直</span>
          </div>
          <div class="fd-setting__card" :class="{ 'is-active': menuLayout === 'horizontal' }" @click="menuLayout = 'horizontal'">
            <div class="fd-setting__preview" v-html="layoutHorizontalSvg"></div>
            <span>水平</span>
          </div>
          <div class="fd-setting__card" :class="{ 'is-active': menuLayout === 'mixed' }" @click="menuLayout = 'mixed'">
            <div class="fd-setting__preview" v-html="layoutMixedSvg"></div>
            <span>混合</span>
          </div>
          <div class="fd-setting__card" :class="{ 'is-active': menuLayout === 'dual' }" @click="menuLayout = 'dual'">
            <div class="fd-setting__preview" v-html="layoutDualSvg"></div>
            <span>双列</span>
          </div>
        </div>
      </div>

      <!-- 菜单风格 -->
      <div class="fd-setting__section">
        <div class="fd-setting__title">菜单风格</div>
        <div class="fd-setting__options">
          <div class="fd-setting__card" :class="{ 'is-active': menuStyle === 'light', 'is-disabled': isMenuStyleDisabled }" @click="!isMenuStyleDisabled && (menuStyle = 'light')">
            <div class="fd-setting__preview" v-html="menuLightSvg"></div>
          </div>
          <div class="fd-setting__card" :class="{ 'is-active': menuStyle === 'dark', 'is-disabled': isMenuStyleDisabled }" @click="!isMenuStyleDisabled && (menuStyle = 'dark')">
            <div class="fd-setting__preview" v-html="menuDarkSvg"></div>
          </div>
          <div
            class="fd-setting__card"
            :class="{ 'is-active': menuStyle === 'transparent', 'is-disabled': isMenuStyleDisabled }"
            @click="!isMenuStyleDisabled && (menuStyle = 'transparent')"
          >
            <div class="fd-setting__preview" v-html="menuTransparentSvg"></div>
          </div>
        </div>
      </div>

      <!-- 系统主题色 -->
      <div class="fd-setting__section">
        <div class="fd-setting__title">系统主题色</div>
        <div class="fd-setting__colors">
          <div v-for="color in themeColors" :key="color" class="fd-setting__color-option" :style="{ backgroundColor: color }" @click="setPrimaryColor(color)">
            <el-icon v-if="primaryColor === color" :size="14"><check /></el-icon>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 界面设置 (Folded or Secondary) -->
      <div class="fd-setting__section">
        <div class="fd-setting__items">
          <div class="fd-setting__item">
            <span>菜单模式</span>
            <el-select v-model="menuMode" class="fd-setting__select--sm">
              <el-option value="accordion" label="手风琴" />
              <el-option value="expand" label="全部展开" />
              <el-option value="collapse" label="全部折叠" />
            </el-select>
          </div>
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
          <!-- 动画设置 -->
          <div class="fd-setting__item">
            <span>过渡动画</span>
            <el-select v-model="transition" class="fd-setting__select--sm">
              <el-option value="fade" label="淡入淡出" />
              <el-option value="slide" label="滑动" />
              <el-option value="zoom" label="缩放" />
              <el-option value="none" label="无动画" />
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import type { MenuMode, MenuStyle, MenuLayout, ThemeStyle, TransitionName } from "@/stores"
import menuDarkSvg from "@/assets/svg/menu-dark.svg?raw"
import menuLightSvg from "@/assets/svg/menu-light.svg?raw"
import themeDarkSvg from "@/assets/svg/theme-dark.svg?raw"
import layoutDualSvg from "@/assets/svg/layout-dual.svg?raw"
import themeLightSvg from "@/assets/svg/theme-light.svg?raw"
import layoutMixedSvg from "@/assets/svg/layout-mixed.svg?raw"
import themeSystemSvg from "@/assets/svg/theme-system.svg?raw"
import layoutVerticalSvg from "@/assets/svg/layout-vertical.svg?raw"
import menuTransparentSvg from "@/assets/svg/menu-transparent.svg?raw"
import layoutHorizontalSvg from "@/assets/svg/layout-horizontal.svg?raw"
import { Check } from "@element-plus/icons-vue"
import { computed } from "vue"
import { useSettingsStore } from "@/stores"

// ==================== 常量与配置 ====================

defineOptions({ name: "fd-setting" })

/** 预设主题色列表 */
const themeColors = [
  "#3b82f6", // 蓝 (Default)
  "#8b5cf6", // 紫
  "#2563eb", // 深蓝
  "#52c41a", // 绿
  "#06b6d4", // 青
  "#fa8c16", // 橙
  "#f43f5e", // 粉/红
]

// ==================== 依赖注入 ====================

const settingsStore = useSettingsStore()

// ==================== 计算属性 ====================

/** 抽屉可见状态 - 与 store 同步 */
const visible = computed({
  get: () => settingsStore.settingsDrawerOpened,
  set: (val) => (val ? settingsStore.openSettingsDrawer() : settingsStore.closeSettingsDrawer()),
})

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

/** 菜单布局 */
const menuLayout = computed({
  get: () => settingsStore.menuLayout,
  set: (val) => settingsStore.setMenuLayout(val as MenuLayout),
})

/** 菜单风格 */
const menuStyle = computed({
  get: () => settingsStore.menuStyle,
  set: (val) => settingsStore.setMenuStyle(val as MenuStyle),
})

/** 菜单风格是否禁用（水平和双列布局下禁用） */
const isMenuStyleDisabled = computed(() => {
  return settingsStore.isHorizontalLayout || settingsStore.isDualLayout
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

// ==================== 事件处理 ====================

/** 设置主题（从点击位置开始圆形扩散动画） */
function setTheme(mode: ThemeStyle, event: MouseEvent) {
  // 获取点击坐标用于动画
  const animationOptions = {
    x: event.clientX,
    y: event.clientY,
  }

  // 根据模式设置主题
  if (mode === "auto") {
    // 系统模式：根据系统偏好设置
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    settingsStore.setThemeStyle("auto")
    settingsStore.setTheme(isDark ? "dark" : "light", animationOptions)
  } else {
    // 手动指定 light 或 dark
    settingsStore.setThemeStyle(mode)
    settingsStore.setTheme(mode as "light" | "dark", animationOptions)
  }
}

/** 设置主题色 */
function setPrimaryColor(color: string) {
  settingsStore.setPrimaryColor(color)
}
</script>

<style lang="scss" scoped>
.fd-setting {
  &__content {
    gap: 20px;
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
  }

  &__section {
    gap: 12px;
    display: flex;
    flex-direction: column;
  }

  &__title {
    color: var(--el-text-color-primary);
    font-size: 14px;
    text-align: center;
    margin-bottom: 5px;
  }

  &__options {
    gap: 8px;
    display: grid;
    justify-items: center;
    grid-template-columns: repeat(3, 1fr);
  }

  &__card {
    gap: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-direction: column;

    span {
      color: var(--el-text-color-regular);
      font-size: 12px;
    }

    &.is-active {
      .fd-setting__preview {
        border-color: var(--el-color-primary);
      }

      span {
        color: var(--el-color-primary);
      }
    }

    &.is-disabled {
      cursor: not-allowed;
      opacity: 0.5;

      .fd-setting__preview {
        pointer-events: none;
      }
    }
  }

  &__preview {
    width: 100%;
    border: 2px solid var(--el-border-color-dark);
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 8px 0 rgb(0 0 0 / 10%);
    transition: all 0.3s;
    border-radius: 8px;

    &:hover {
      opacity: 0.85;
    }

    // SVG 图标样式
    :deep(svg) {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  &__colors {
    gap: 12px;
    display: flex;
    padding: 0 10px;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__color-option {
    width: 24px;
    cursor: pointer;
    height: 24px;
    display: flex;
    transition: all 0.2s;
    align-items: center;
    border-radius: 50%;
    justify-content: center;

    &:hover {
      transform: scale(1.1);
    }

    .el-icon {
      color: #fff;
    }
  }

  &__items {
    display: flex;
    padding: 0 10px;
    flex-direction: column;
  }

  &__item {
    display: flex;
    padding: 10px 0;
    font-size: 14px;
    align-items: center;
    border-bottom: 1px solid var(--el-border-color-lighter);
    justify-content: space-between;

    &:last-child {
      border-bottom: none;
    }

    span {
      color: var(--el-text-color-primary);
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
