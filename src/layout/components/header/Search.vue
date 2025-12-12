<template>
  <div>
    <!-- 搜索按钮 -->
    <el-tooltip content="搜索 (Ctrl+K)">
      <el-icon class="header-action" @click="openSearch">
        <Search />
      </el-icon>
    </el-tooltip>

    <!-- 搜索对话框 -->
    <el-dialog
      v-model="visible"
      :show-close="false"
      :close-on-click-modal="true"
      width="560px"
      top="10vh"
      class="search-dialog"
    >
      <template #header>
        <div class="search-header">
          <el-icon class="search-icon"><Search /></el-icon>
          <input
            ref="inputRef"
            v-model="keyword"
            class="search-input"
            placeholder="搜索菜单..."
            @keydown.enter="handleSelect(filteredMenus[activeIndex])"
            @keydown.up.prevent="moveUp"
            @keydown.down.prevent="moveDown"
            @keydown.esc="closeSearch"
          />
          <kbd class="search-kbd">ESC</kbd>
        </div>
      </template>

      <!-- 搜索结果 -->
      <div v-if="filteredMenus.length > 0" class="search-results">
        <div
          v-for="(item, index) in filteredMenus"
          :key="item.path"
          class="search-item"
          :class="{ 'is-active': index === activeIndex }"
          @click="handleSelect(item)"
          @mouseenter="activeIndex = index"
        >
          <el-icon v-if="item.icon" class="search-item__icon">
            <component :is="item.icon" />
          </el-icon>
          <span class="search-item__title">{{ item.title }}</span>
          <span class="search-item__path">{{ item.path }}</span>
        </div>
      </div>

      <!-- 无结果提示 -->
      <div v-else-if="keyword" class="search-empty">
        <el-icon :size="48"><Search /></el-icon>
        <p>未找到相关菜单</p>
      </div>

      <!-- 默认提示 -->
      <div v-else class="search-tips">
        <p>输入关键词搜索菜单</p>
        <div class="search-tips__keys">
          <span><kbd>↑</kbd><kbd>↓</kbd> 选择</span>
          <span><kbd>Enter</kbd> 确认</span>
          <span><kbd>ESC</kbd> 关闭</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 全局搜索组件
 * 支持菜单搜索和快捷键操作
 */
import type { BackendMenu } from "@/stores/permission/interface"
import { useRouter } from "vue-router"
import { useMenuStore } from "@/stores/menu"
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from "vue"

interface SearchMenuItem {
  path: string
  title: string
  icon?: string
}

const router = useRouter()
const menuStore = useMenuStore()

const visible = ref(false)
const keyword = ref("")
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement>()

/** 扁平化菜单列表（用于搜索） */
const flattenMenus = computed(() => {
  const result: SearchMenuItem[] = []

  function flatten(menus: BackendMenu[], parentPath = "") {
    menus.forEach((menu) => {
      const path = parentPath ? `${parentPath}/${menu.path}` : menu.path

      // 只添加有 title 的菜单
      if (menu.meta?.title) {
        result.push({
          path,
          title: menu.meta.title as string,
          icon: menu.meta.icon as string | undefined,
        })
      }

      // 递归处理子菜单
      if (menu.children?.length) {
        flatten(menu.children, path)
      }
    })
  }

  flatten(menuStore.visibleMenus)
  return result
})

/** 过滤后的菜单列表 */
const filteredMenus = computed(() => {
  if (!keyword.value) return []

  const kw = keyword.value.toLowerCase()
  return flattenMenus.value.filter(
    item => item.title.toLowerCase().includes(kw) || item.path.toLowerCase().includes(kw),
  )
})

/** 打开搜索 */
function openSearch() {
  visible.value = true
  keyword.value = ""
  activeIndex.value = 0
  nextTick(() => {
    inputRef.value?.focus()
  })
}

/** 关闭搜索 */
function closeSearch() {
  visible.value = false
}

/** 选择菜单项 */
function handleSelect(item: SearchMenuItem | undefined) {
  if (!item) return
  router.push(item.path)
  closeSearch()
}

/** 向上移动 */
function moveUp() {
  if (activeIndex.value > 0) {
    activeIndex.value--
  }
}

/** 向下移动 */
function moveDown() {
  if (activeIndex.value < filteredMenus.value.length - 1) {
    activeIndex.value++
  }
}

/** 监听关键词变化，重置激活索引 */
watch(keyword, () => {
  activeIndex.value = 0
})

/** 全局快捷键监听 */
function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault()
    openSearch()
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown)
})
</script>

<style lang="scss" scoped>
.header-action {
  width: 36px;
  cursor: pointer;
  height: 36px;
  display: flex;
  font-size: 18px;
  transition: background-color $transition-duration;
  align-items: center;
  border-radius: $border-radius;
  justify-content: center;

  &:hover {
    background-color: $bg-color;
  }
}

.search-dialog {
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 0;
  }

  :deep(.el-dialog__body) {
    padding: 0;
    max-height: 400px;
    overflow-y: auto;
  }
}

.search-header {
  gap: $spacing-sm;
  display: flex;
  padding: $spacing-base;
  align-items: center;
  border-bottom: 1px solid $border-color;

  .search-icon {
    color: $text-secondary;
    font-size: 20px;
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    color: $text-primary;
    border: none;
    outline: none;
    font-size: 16px;
    background: transparent;

    &::placeholder {
      color: $text-placeholder;
    }
  }

  .search-kbd {
    color: $text-secondary;
    border: 1px solid $border-color;
    padding: 2px 6px;
    font-size: 12px;
    flex-shrink: 0;
    border-radius: 4px;
    background-color: $bg-color;
  }
}

.search-results {
  padding: $spacing-sm;
}

.search-item {
  gap: $spacing-sm;
  cursor: pointer;
  display: flex;
  padding: $spacing-sm $spacing-base;
  transition: all $transition-duration;
  align-items: center;
  border-radius: $border-radius;

  &:hover,
  &.is-active {
    background-color: $bg-color;
  }

  &.is-active {
    color: $primary-color;
  }

  &__icon {
    font-size: 18px;
    flex-shrink: 0;
  }

  &__title {
    flex: 1;
    font-weight: 500;
  }

  &__path {
    color: $text-secondary;
    font-size: 12px;
  }
}

.search-empty,
.search-tips {
  gap: $spacing-sm;
  color: $text-secondary;
  display: flex;
  padding: $spacing-xl;
  text-align: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.search-tips {
  &__keys {
    gap: $spacing-base;
    display: flex;
    font-size: 12px;

    kbd {
      color: $text-secondary;
      border: 1px solid $border-color;
      margin: 0 2px;
      padding: 2px 6px;
      border-radius: 4px;
      background-color: $bg-color;
    }
  }
}
</style>
