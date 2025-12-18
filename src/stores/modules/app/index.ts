import type { AppState } from "./types"
import { defineStore } from "pinia"

export const useAppStore = defineStore("app", {
  state: (): AppState => ({
    token: "",
    refreshToken: "",
  }),

  getters: {},

  actions: {
    initialize() {},

    setToken(token: string) {
      this.token = token
    },
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken
    },
  },

  persist: {
    key: "app",
    pick: ["token", "refreshToken"],
  },
})
