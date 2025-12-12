<template>
  <div>
    <!-- 搜索按钮 -->
    <el-tooltip content="搜索 (Ctrl+K)">
      <el-icon class="action-btn" @click="openSearch">
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
import type { BackendMenu } from "@/stores/permission/interface"
import { useRouter } from "vue-router"
import { useMenuStore } from "@/stores/menu"
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from "vue"

defineOptions({ name: "topbar-search" })

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

/** 扁平化菜单列表 */
const flattenMenus = computed(() => {
  const result: SearchMenuItem[] = []

  function flatten(menus: BackendMenu[], parentPath = "") {
    menus.forEach((menu) => {
      const path = parentPath ? `${parentPath}/${menu.path}` : menu.path

      if (menu.meta?.title) {
        result.push({
          path,
          title: menu.meta.title as string,
          icon: menu.meta.icon as string | undefined,
        })
      }

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

function openSearch() {
  visible.value = true
  keyword.value = ""
  activeIndex.value = 0
  nextTick(() => inputRef.value?.focus())
}

function closeSearch() {
  visible.value = false
}

function handleSelect(item: SearchMenuItem | undefined) {
  if (!item) return
  router.push(item.path)
  closeSearch()
}

function moveUp() {
  if (activeIndex.value > 0) activeIndex.value--
}

function moveDown() {
  if (activeIndex.value < filteredMenus.value.length - 1) activeIndex.value++
}

watch(keyword, () => {
  activeIndex.value = 0
})

function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault()
    openSearch()
  }
}

onMounted(() => document.addEventListener("keydown", handleKeydown))
onUnmounted(() => document.removeEventListener("keydown", handleKeydown))
</script>

<style lang="scss" scoped>
.action-btn {
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  transition: all 0.2s;
  border-radius: 6px;

  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-fill-color-light);
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
  border-bottom: 1px solid var(--el-border-color);

  .search-icon {
    color: var(--el-text-color-secondary);
    font-size: 20px;
    flex-shrink: 0;
  }

  .search-input {
    flex: 1;
    color: var(--el-text-color-primary);
    border: none;
    outline: none;
    font-size: 16px;
    background: transparent;

    &::placeholder {
      color: var(--el-text-color-placeholder);
    }
  }

  .search-kbd {
    color: var(--el-text-color-secondary);
    border: 1px solid var(--el-border-color);
    padding: 2px 6px;
    font-size: 12px;
    flex-shrink: 0;
    border-radius: 4px;
    background-color: var(--el-fill-color);
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
  transition: all 0.2s;
  align-items: center;
  border-radius: 6px;

  &:hover,
  &.is-active {
    background-color: var(--el-fill-color);
  }

  &.is-active {
    color: var(--el-color-primary);
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
    color: var(--el-text-color-secondary);
    font-size: 12px;
  }
}

.search-empty,
.search-tips {
  gap: $spacing-sm;
  color: var(--el-text-color-secondary);
  display: flex;
  padding: $spacing-xl;
  text-align: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.search-tips__keys {
  gap: $spacing-base;
  display: flex;
  font-size: 12px;

  kbd {
    color: var(--el-text-color-secondary);
    border: 1px solid var(--el-border-color);
    margin: 0 2px;
    padding: 2px 6px;
    border-radius: 4px;
    background-color: var(--el-fill-color);
  }
}
</style>
