/**
 * 移动端设备检测 Hook
 * 提供响应式的设备类型检测能力
 */
import { ref, computed, onMounted, onUnmounted } from "vue"

/** 移动端断点 */
const BREAKPOINT_MOBILE = 768

/** 全局共享的窗口宽度状态（单例模式） */
const windowWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1200)

/** 是否已初始化监听器 */
let isListenerInitialized = false

/** resize 处理函数 */
function handleResize() {
  windowWidth.value = window.innerWidth
}

/**
 * 移动端检测 Hook
 * @returns 返回 isMobile 响应式状态
 */
export function useMobile() {
  /** 是否为移动端 (< 768px) */
  const isMobile = computed(() => windowWidth.value < BREAKPOINT_MOBILE)

  onMounted(() => {
    // 确保只初始化一次监听器
    if (!isListenerInitialized) {
      windowWidth.value = window.innerWidth
      window.addEventListener("resize", handleResize)
      isListenerInitialized = true
    }
  })

  onUnmounted(() => {
    // 注意：这里不移除监听器，因为是全局共享的
    // 如果需要完全清理，可以在应用卸载时手动调用
  })

  return { isMobile }
}
