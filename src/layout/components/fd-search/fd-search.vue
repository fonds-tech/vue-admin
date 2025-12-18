<template>
  <el-dialog v-model="visible" :show-close="false" :close-on-click-modal="true" :close-on-press-escape="true" width="50vw" class="fd-search" @close="close" @keydown.stop>
    <div class="flex flex-col">
      <!-- 搜索输入框 -->
      <div class="fd-search__input-wrapper">
        <div class="fd-search__input-inner">
          <div class="fd-search__icon fd-search__icon--start">
            <fd-icon icon="ri:search-line" :size="18" />
          </div>

          <input
            ref="inputRef"
            v-model="searchQuery"
            type="text"
            placeholder="搜索菜单页面、关键词或路径..."
            class="fd-search__input"
            @keydown.up.prevent="navigateList(-1)"
            @keydown.down.prevent="navigateList(1)"
            @keydown.enter.prevent="handleSelect"
            @keydown.esc="close"
          />

          <div class="fd-search__icon fd-search__icon--end" :class="{ 'is-visible': searchQuery }">
            <fd-icon icon="ri:input-method-line" :size="16" />
          </div>
        </div>
      </div>

      <!-- 搜索结果列表 -->
      <div class="fd-search__results">
        <div v-if="searchQuery && filteredResults.length === 0" class="fd-search__empty">
          <fd-icon icon="ri:search-2-line" :size="32" />
          <span>未找到匹配的菜单</span>
        </div>

        <div
          v-for="(item, index) in filteredResults"
          :key="item.id"
          class="fd-search__item"
          :class="{ 'is-active': activeIndex === index }"
          @click="navigateTo(item)"
          @mouseenter="activeIndex = index"
        >
          <div class="fd-search__item-left">
            <fd-icon :icon="item.icon || 'ri:file-line'" :size="16" />
            <span class="fd-search__item-title">{{ item.title }}</span>
            <span v-if="item.parentTitle" class="fd-search__item-path">
              {{ item.parentTitle }}
            </span>
          </div>

          <div class="fd-search__item-right">
            <fd-icon icon="ri:corner-down-left-line" :size="14" />
          </div>
        </div>
      </div>
      <div class="fd-search__shortcuts">
        <div class="fd-search__shortcut-item">
          <div class="fd-search__key">
            <fd-icon icon="ri:arrow-up-line" :size="12" />
            <fd-icon icon="ri:arrow-down-line" :size="12" />
          </div>
          <span>切换</span>
        </div>
        <div class="fd-search__shortcut-item">
          <div class="fd-search__key">Enter</div>
          <span>确认</span>
        </div>
        <div class="fd-search__shortcut-item">
          <div class="fd-search__key">Esc</div>
          <span>关闭</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue"
import { useRouter } from "vue-router"
import { useMenuStore } from "@/stores/menu"
import type { Menu } from "@/stores/menu/types"
import { Icon as FdIcon } from "@/components/core/fd-icon"
import { treeToList } from "@/utils/array"

defineOptions({ name: "fd-search" })

// ===================== 类型定义 =====================

interface SearchResult {
  id: number
  title: string
  path: string
  name: string
  icon?: string
  parentTitle?: string
  type: number
}

// ===================== 状态管理 =====================

const router = useRouter()
const menuStore = useMenuStore()
const visible = ref(false)
const searchQuery = ref("")
const activeIndex = ref(-1)
const inputRef = ref<HTMLInputElement>()

// ===================== 搜索逻辑 =====================

/** 获取扁平化的菜单列表 */
const flatMenuList = computed<Menu[]>(() => {
  return treeToList(menuStore.menus)
})

/**
 * 获取完整的菜单标题链
 * 例如: 用户管理 -> 系统管理
 */
function getMenuChain(menu: Menu): string[] {
  const chain: string[] = [menu.title]
  let current = menu
  let parent = flatMenuList.value.find((m) => m.id === current.parentId)

  // 向上查找父级（最多3级）
  let depth = 0
  while (parent && parent.parentId > 0 && depth < 3) {
    chain.unshift(parent.title)
    current = parent
    parent = flatMenuList.value.find((m) => m.id === current.parentId)
    depth++
  }

  return chain
}

/**
 * 过滤菜单 - 只返回可访问的页面 (type === 1)
 */
const filteredResults = computed<SearchResult[]>(() => {
  if (!searchQuery.value.trim()) {
    return []
  }

  const query = searchQuery.value.toLowerCase().trim()

  const results = flatMenuList.value
    .filter((menu) => menu.type === 1 && menu.status === 1) // 只返回页面类型
    .filter((menu) => {
      const title = menu.title?.toLowerCase() || ""
      const name = menu.name?.toLowerCase() || ""
      const path = menu.path?.toLowerCase() || ""
      return title.includes(query) || name.includes(query) || path.includes(query)
    })
    .map((menu) => {
      const chain = getMenuChain(menu)
      const parentTitle = chain.length > 1 ? chain.slice(0, -1).join(" / ") : undefined

      return {
        id: menu.id,
        title: menu.title,
        path: menu.path,
        name: menu.name,
        icon: menu.icon,
        parentTitle,
        type: menu.type,
      }
    })

  // 重置激活索引当搜索结果变化
  if (results.length > 0) {
    activeIndex.value = 0
  } else {
    activeIndex.value = -1
  }

  return results
})

// ===================== 键盘导航 =====================

function navigateList(direction: number) {
  if (filteredResults.value.length === 0) return

  let newIndex = activeIndex.value + direction

  // 循环导航
  if (newIndex < 0) {
    newIndex = filteredResults.value.length - 1
  } else if (newIndex >= filteredResults.value.length) {
    newIndex = 0
  }

  activeIndex.value = newIndex
}

function handleSelect() {
  if (activeIndex.value >= 0 && activeIndex.value < filteredResults.value.length) {
    const target = filteredResults.value[activeIndex.value]
    if (target) {
      navigateTo(target)
    }
  }
}

// ===================== 导航处理 =====================

function navigateTo(item: SearchResult) {
  if (!item) return

  // 关闭弹窗
  visible.value = false

  // 路由跳转
  router.push(item.path)

  // 清空搜索
  searchQuery.value = ""
  activeIndex.value = -1
}

// ===================== 弹窗控制 =====================

function open() {
  visible.value = true
  // 需要延迟等待弹窗渲染完成
  nextTick(() => {
    setTimeout(() => {
      inputRef.value?.focus()
    }, 100)
  })
}

function close() {
  visible.value = false
  searchQuery.value = ""
  activeIndex.value = -1
}

// ===================== 暴露 API =====================

defineExpose({
  open,
  close,
})

// ===================== 监听器 =====================

// 监听输入实时搜索（已包含在 computed 中）
// 搜索结果为空时重置索引
watch(searchQuery, (newVal) => {
  if (!newVal) {
    activeIndex.value = -1
  }
})
</script>

<style lang="scss">
/* 全局样式 - 用于覆盖 el-dialog 样式，因为 dialog 被插入到 body */
.fd-search.el-dialog {
  background: var(--bg-color-container);
  border-radius: 12px;
  box-shadow: 0 20px 48px rgb(0 0 0 / 15%);

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    display: flex;
    flex-direction: column;
    max-height: 420px;
    padding: 0;
    overflow: hidden;
  }

  .el-dialog__footer {
    padding: 12px 20px 16px;
    background: var(--bg-color-container);
    border-top: 1px solid var(--el-border-color-lighter);
    border-radius: 0 0 12px 12px;
  }
}

/* 深色模式适配 */
.el-overlay-dialog .fd-search.el-dialog {
  --el-bg-color-overlay: rgb(0 0 0 / 60%);
}

/* 移动端适配 */
@media (width <= 640px) {
  .fd-search.el-dialog {
    width: 90% !important;
    max-width: 420px;
  }
}
</style>

<style lang="scss" scoped>
.fd-search {
  /* 搜索输入框容器 */
  &__input-wrapper {
    padding: 20px 20px 16px;
    background: var(--bg-color-container);
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  &__input-inner {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color);
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--el-border-color-hover);
    }

    &:focus-within {
      border-color: var(--el-color-primary);
      box-shadow: 0 0 0 2px rgb(59 130 246 / 10%);
    }
  }

  &__input {
    flex: 1;
    height: 40px;
    padding: 0 12px;
    font-size: 14px;
    color: var(--el-text-color-primary);
    outline: none;
    background: transparent;
    border: none;

    &::placeholder {
      color: var(--el-text-color-placeholder);
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-secondary);

    &--start {
      padding-left: 12px;
    }

    &--end {
      padding-right: 12px;
      opacity: 0;
      transition: opacity 0.2s;

      &.is-visible {
        color: var(--el-color-primary);
        opacity: 1;
      }
    }
  }

  /* 搜索结果区域 */
  &__results {
    flex: 1;
    min-height: 120px;
    max-height: 320px;
    overflow-y: auto;

    // 滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--el-border-color-lighter);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--el-border-color);
    }
  }

  /* 空状态 */
  &__empty {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    padding: 40px 20px;
    color: var(--el-text-color-placeholder);

    span {
      font-size: 14px;
      letter-spacing: 1px;
    }
  }

  /* 搜索项 */
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    font-size: 13px;
    cursor: pointer;
    border-bottom: 1px solid var(--el-border-color-lighter);
    transition: all 0.15s ease;

    &:last-child {
      border-bottom: none;
    }

    &.is-active {
      color: white !important;
      background: var(--el-color-primary);

      .fd-search__item-title,
      .fd-search__item-path,
      .fd-search__item-right {
        color: white !important;
      }

      .fd-search__item-path {
        opacity: 0.85;
      }
    }

    &:hover:not(.is-active) {
      background: var(--el-fill-color-light-3);
    }
  }

  &__item-left {
    display: flex;
    flex: 1;
    gap: 8px;
    align-items: center;
    overflow: hidden;
  }

  &__item-title {
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    color: var(--el-text-color-regular);
    white-space: nowrap;
  }

  &__item-path {
    padding-left: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    white-space: nowrap;

    &::before {
      margin: 0 4px;
      content: "·";
    }
  }

  &__item-right {
    display: flex;
    align-items: center;
    color: var(--el-text-color-placeholder);
  }

  /* 快捷键提示 */
  &__shortcuts {
    display: flex;
    gap: 20px;
    justify-content: center;
    padding-top: 8px;
  }

  &__shortcut-item {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 12px;
    color: var(--el-text-color-secondary);

    span {
      font-size: 12px;
    }
  }

  &__key {
    display: flex;
    gap: 2px;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    padding: 3px 6px;
    font-family: monospace;
    font-weight: 500;
    background: var(--el-fill-color-lighter);
    border: 1px solid var(--el-border-color-light);
    border-radius: 4px;

    :deep(svg) {
      width: 12px;
      height: 12px;
    }
  }
}

/* 移动端适配 helper */
@media (width <= 640px) {
  .fd-search {
    &__shortcuts {
      display: none;
    }
  }
}
</style>
