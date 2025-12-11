import { ref } from "vue"

/**
 * 加载状态管理 Hook
 * @param initialValue 初始加载状态
 */
export function useLoading(initialValue = false) {
  const loading = ref(initialValue)

  /**
   * 开始加载
   */
  function startLoading() {
    loading.value = true
  }

  /**
   * 停止加载
   */
  function stopLoading() {
    loading.value = false
  }

  /**
   * 包装异步函数，自动处理加载状态
   */
  async function withLoading<T>(fn: () => Promise<T>): Promise<T> {
    try {
      startLoading()
      return await fn()
    }
    finally {
      stopLoading()
    }
  }

  return {
    loading,
    startLoading,
    stopLoading,
    withLoading,
  }
}
