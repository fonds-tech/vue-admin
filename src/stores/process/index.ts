/**
 * Process 进程标签状态管理
 * 管理多标签页的添加、删除、切换等操作
 */
import type { ProcessItem, ProcessState } from "./types"
import { defineStore } from "pinia"

export const useProcessStore = defineStore("process", {
  state: (): ProcessState => ({
    list: [],
  }),

  getters: {
    /** 获取需要缓存的组件名列表（与 keep-alive 联动） */
    cacheList: (state): string[] => {
      return state.list
        .filter(item => item.name)
        .map(item => item.name)
    },

    /** 获取当前激活的标签 */
    activeItem: (state): ProcessItem | undefined => {
      return state.list.find(item => item.active)
    },
  },

  actions: {
    /**
     * 添加进程标签
     * @param item 进程项数据
     */
    add(item: Omit<ProcessItem, "active"> & { active?: boolean }) {
      // 先将所有标签设为非激活
      this.list.forEach((e) => {
        e.active = false
      })

      // 查找是否已存在相同路径的标签
      const index = this.list.findIndex(e => e.path === item.path)

      if (index < 0) {
        // 不存在则添加新标签
        this.list.push({
          ...item,
          active: true,
        })
      }
      else {
        // 存在则更新并激活
        const existItem = this.list[index]
        if (existItem) {
          Object.assign(existItem, item, { active: true })
        }
      }
    },

    /**
     * 移除指定索引的标签
     * @param index 标签索引
     */
    remove(index: number) {
      const item = this.list[index]
      // 固定标签不可移除
      if (item?.affix) return

      this.list.splice(index, 1)
    },

    /**
     * 移除其他标签（保留当前标签和固定标签）
     * @param item 要保留的标签
     */
    removeOther(item: ProcessItem) {
      this.list = this.list.filter(e => e.path === item.path || e.affix)
    },

    /**
     * 清空所有非固定标签
     */
    clear() {
      this.list = this.list.filter(e => e.affix)
    },

    /**
     * 设置指定路径的标签为激活状态
     * @param path 路由路径
     */
    setActive(path: string) {
      this.list.forEach((e) => {
        e.active = e.path === path
      })
    },

    /**
     * 设置标签列表
     * @param data 标签列表数据
     */
    set(data: ProcessItem[]) {
      this.list = data
    },

    /**
     * 更新当前激活标签的标题
     * @param title 新标题
     */
    setTitle(title: string) {
      const item = this.list.find(e => e.active)
      if (item) {
        item.title = title
      }
    },
  },

  // 持久化配置
  persist: {
    key: "process-store",
    pick: ["list"],
  },
})
