/**
 * 应用状态管理（选项式）
 */
import type { AppState } from "./types"
import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
  state: (): AppState => ({}),
  getters: {},
  actions: {},
})
