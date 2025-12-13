/**
 * Alova 请求实例
 * 使用 axios 适配器
 */
import type { ApiResponse } from "./types"
import router from "@/router"
import VueHook from "alova/vue"
import { ElMessage } from "element-plus"
import { createAlova } from "alova"
import { ResponseCode } from "./types"
import { useUserStore } from "@/stores/user"
import { axiosRequestAdapter } from "@alova/adapter-axios"

/** 创建 Alova 实例 */
const alova = createAlova({
  // 基础路径
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  // 超时时间
  timeout: 30000,
  // 使用 Vue 状态管理钩子
  statesHook: VueHook,
  // 使用 axios 适配器
  requestAdapter: axiosRequestAdapter(),

  // 请求前拦截
  beforeRequest: (method) => {
    const userStore = useUserStore()

    // 添加 Token
    if (userStore.token) {
      method.config.headers.Authorization = `Bearer ${userStore.token}`
    }
  },

  // 响应处理
  responded: {
    // 请求成功处理
    onSuccess: async (response) => {
      const data = response.data as ApiResponse

      // 业务状态码判断
      if (data.code !== ResponseCode.SUCCESS) {
        ElMessage.error(data.message || "请求失败")

        // 未授权，跳转登录
        if (data.code === ResponseCode.UNAUTHORIZED) {
          const userStore = useUserStore()
          userStore.logout()
          router.push("/login")
        }

        throw new Error(data.message || "请求失败")
      }

      // 返回业务数据
      return data.data
    },

    // 请求失败处理
    onError: (error) => {
      console.error("请求错误:", error)

      // HTTP 状态码错误处理
      const status = error.response?.status
      let message = "请求失败"

      switch (status) {
        case 401: {
          message = "登录已过期，请重新登录"
          const userStore = useUserStore()
          userStore.logout()
          router.push("/login")
          break
        }
        case 403:
          message = "没有权限访问该资源"
          break
        case 404:
          message = "请求的资源不存在"
          break
        case 500:
          message = "服务器内部错误"
          break
        default:
          message = error.message || "网络异常"
      }

      ElMessage.error(message)
      throw error
    },
  },
})

export default alova
