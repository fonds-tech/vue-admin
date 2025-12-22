import { computed } from "vue"
import { useSettingsStore } from "@/stores"

/**
 * 布局模式管理 composable
 * 统一管理布局相关的计算属性，避免在多个组件中重复定义
 */
export function useLayoutMode() {
  const settingsStore = useSettingsStore()

  /** 是否为垂直布局 */
  const isVertical = computed(() => settingsStore.isVerticalLayout)

  /** 是否为水平布局 */
  const isHorizontal = computed(() => settingsStore.isHorizontalLayout)

  /** 是否为混合布局 */
  const isMixed = computed(() => settingsStore.isMixedLayout)

  /** 是否为双列布局 */
  const isDual = computed(() => settingsStore.isDualLayout)

  /** 是否需要显示侧边栏（非水平布局） */
  const showSidebar = computed(() => !isHorizontal.value)

  /** 是否需要显示水平菜单（水平或混合布局） */
  const showHorizontalMenu = computed(() => isHorizontal.value || isMixed.value)

  /** 是否需要显示折叠按钮（垂直、混合或双列布局） */
  const showCollapse = computed(() => isVertical.value)

  return {
    isVertical,
    isHorizontal,
    isMixed,
    isDual,
    showSidebar,
    showHorizontalMenu,
    showCollapse,
  }
}
