<template>
  <div class="fd-process">
    <!-- 导航操作区 -->
    <div class="fd-process__nav">
      <div class="fd-process__nav-item" title="返回" @click="onClickBack">
        <fd-icon icon="ri:arrow-left-line" :size="14" />
      </div>
      <div class="fd-process__nav-item" title="刷新" @click="onClickRefresh">
        <fd-icon icon="ri:refresh-line" :size="14" />
      </div>
      <div class="fd-process__nav-item" title="首页" @click="onClickHome">
        <fd-icon icon="ri:home-4-line" :size="14" />
      </div>
    </div>

    <!-- 标签列表区 -->
    <div ref="scrollContainer" class="fd-process__list" @wheel="onWheel">
      <div class="process__scroll">
        <div
          v-for="(item, index) in processStore.list"
          :key="item.path"
          class="process-item"
          :class="{ 'is-active': item.path === route.path }"
          @click="onClickItem(item)"
          @contextmenu="(e: MouseEvent) => onContextMenu(e, item, index)"
        >
          <span class="process-item__title">{{ item.title }}</span>
          <fd-icon
            v-if="!item.affix"
            icon="ri:close-line"
            :size="14"
            class="process-item__close"
            @click.stop="onClickClose(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProcessItem } from "@/stores"
import { useMitt } from "@/hooks"
import { contextMenu } from "@fonds/vue-crud"
import { Icon as FdIcon } from "@/components/core/fd-icon"
import { useProcessStore } from "@/stores"
import { useRoute, useRouter } from "vue-router"
import { ref, watch, nextTick, onMounted } from "vue"

defineOptions({ name: "fd-process" })

const mitt = useMitt("layout")
const route = useRoute()
const router = useRouter()
const processStore = useProcessStore()
const scrollContainer = ref<HTMLElement | null>(null)

// ==================== 监听器 ====================

// 路由变化时滚动到激活标签
watch(
  () => route.path,
  () => {
    scrollToActive()
  },
)

// ==================== 生命周期 ====================

// 初始化时滚动到激活标签
onMounted(() => {
  scrollToActive()
})

// ==================== 工具函数 ====================

/**
 * 跳转到最后一个标签或首页
 */
function toLastOrHome() {
  const activeItem = processStore.list.find(e => e.active)
  if (!activeItem) {
    const last = processStore.list[processStore.list.length - 1]
    router.push(last ? last.fullPath : "/")
  }
}

/**
 * 滚动到激活的标签
 */
function scrollToActive() {
  nextTick(() => {
    const activeEl = scrollContainer.value?.querySelector(".is-active")
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }
  })
}

// ==================== 事件处理 ====================

/**
 * 点击返回按钮
 */
function onClickBack() {
  router.back()
}

/**
 * 点击刷新按钮
 */
function onClickRefresh() {
  mitt.emit("process:refresh")
}

/**
 * 点击首页按钮
 */
function onClickHome() {
  router.push("/")
}

/**
 * 点击标签项
 */
function onClickItem(item: ProcessItem) {
  router.push(item.fullPath)
}

/**
 * 点击关闭标签
 */
function onClickClose(index: number) {
  const item = processStore.list[index]
  const isActive = item?.active

  processStore.remove(index)

  // 如果关闭的是当前激活的标签，跳转到其他标签
  if (isActive) {
    toLastOrHome()
  }
}

/**
 * 关闭其他标签
 */
function closeOther(item: ProcessItem) {
  processStore.removeOther(item)
  router.push(item.fullPath)
}

/**
 * 关闭所有标签
 */
function closeAll() {
  processStore.clear()
  router.push("/")
}

/**
 * 右键菜单处理
 */
function onContextMenu(event: MouseEvent, item: ProcessItem, index: number) {
  contextMenu.open(event, {
    list: [
      {
        label: "关闭当前",
        disabled: item.affix,
        onClick: () => onClickClose(index),
      },
      {
        label: "关闭其他",
        onClick: () => closeOther(item),
      },
      {
        label: "关闭所有",
        onClick: () => closeAll(),
      },
    ],
  })
}

/**
 * 鼠标滚轮横向滚动
 */
function onWheel(event: WheelEvent) {
  if (scrollContainer.value) {
    event.preventDefault()
    scrollContainer.value.scrollLeft += event.deltaY * 2
  }
}
</script>

<style lang="scss">
.fd-process {
  gap: var(--fd-process-gap);
  display: flex;
  padding: var(--fd-process-padding-y) var(--fd-process-padding-x);
  position: relative;
  align-items: center;
  background-color: var(--el-bg-color);

  &::before {
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    content: "";
    position: absolute;
    background-color: var(--el-border-color-extra-light);
  }

  // 导航操作区
  &__nav {
    gap: var(--fd-process-nav-gap);
    height: 100%;
    display: flex;
    align-items: center;
    flex-shrink: 0;

    // 导航按钮项
    &-item {
      width: var(--fd-process-nav-size);
      border: 1px solid var(--el-fill-color-dark);
      cursor: pointer;
      height: var(--fd-process-nav-size);
      display: flex;
      transition: all 0.2s ease-in-out;
      align-items: center;
      border-radius: var(--fd-process-nav-radius);
      justify-content: center;

      &:hover {
        color: var(--el-color-primary);
        background-color: var(--el-fill-color-dark);
      }
    }
  }

  // 标签列表区
  &__list {
    flex: 1;
    height: 100%;
    overflow: hidden;
    position: relative;
    min-width: 0;
    overflow-x: auto;

    // 隐藏滚动条
    &::-webkit-scrollbar {
      height: 0;
      display: none;
    }
  }

  // 滚动容器
  .process__scroll {
    gap: var(--fd-process-item-gap);
    height: 100%;
    display: flex;
    padding: var(--fd-process-scroll-padding-y) 0;
    align-items: center;
  }

  // 标签项
  .process-item {
    color: $text-regular;
    border: 1px solid var(--el-fill-color-dark);
    cursor: pointer;
    height: var(--fd-process-item-height);
    display: flex;
    padding: 0 var(--fd-process-item-padding-x);
    position: relative;
    font-size: 12px;
    transition: all 0.2s ease-in-out;
    align-items: center;
    border-radius: var(--fd-process-item-radius);
    background-color: transparent;

    &__title {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__close {
      width: 0;
      opacity: 0;
      overflow: hidden;
      font-size: 10px;
      transition: all 0.2s ease-in-out;
      border-radius: var(--fd-process-item-radius);

      &:hover {
        background-color: rgb(0 0 0 / 10%);
      }
    }

    // hover 状态
    &:hover:not(.is-active) {
      color: var(--el-color-primary);
      background-color: var(--el-fill-color-dark);
    }

    // 激活状态
    &.is-active {
      color: #fff;
      font-weight: 500;
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary);

      .process-item__close:hover {
        background-color: rgb(255 255 255 / 20%);
      }
    }

    // hover 或 激活状态 - 显示关闭按钮
    &:hover,
    &.is-active {
      .process-item__close {
        width: var(--fd-process-close-size);
        opacity: 1;
        margin-left: var(--fd-process-item-gap);
      }
    }
  }
}
</style>
