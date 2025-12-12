<template>
  <div class="process">
    <!-- 导航操作区 -->
    <div class="process__nav">
      <div class="nav-item" title="返回" @click="onClickBack">
        <el-icon><ArrowLeft /></el-icon>
      </div>
      <div class="nav-item" title="刷新" @click="onClickRefresh">
        <el-icon><Refresh /></el-icon>
      </div>
      <div class="nav-item" title="首页" @click="onClickHome">
        <el-icon><HomeFilled /></el-icon>
      </div>
    </div>

    <!-- 标签列表区 -->
    <div ref="scrollContainer" class="process__list" @wheel="onWheel">
      <div class="process__scroll">
        <el-dropdown
          v-for="(item, index) in processStore.list"
          :key="item.path"
          trigger="contextmenu"
          @command="(cmd: string) => onContextMenuCommand(cmd, item, index)"
        >
          <div
            class="process-item"
            :class="{ 'is-active': item.path === route.path }"
            @click="onClickItem(item)"
          >
            <span class="process-item__title">{{ item.title }}</span>
            <el-icon
              v-if="!item.affix"
              class="process-item__close"
              @click.stop="onClickClose(index)"
            >
              <Close />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="close" :disabled="item.affix">
                关闭当前
              </el-dropdown-item>
              <el-dropdown-item command="closeOther">
                关闭其他
              </el-dropdown-item>
              <el-dropdown-item command="closeAll">
                关闭所有
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 进程标签组件
 * 多标签页导航
 */
import type { ProcessItem } from "@/stores/process/interface"
import { emitter } from "@/utils/mitt"
import { useProcessStore } from "@/stores"
import { useRoute, useRouter } from "vue-router"
import { ref, watch, nextTick, onMounted } from "vue"

defineOptions({ name: "layout-process" })

const route = useRoute()
const router = useRouter()
const processStore = useProcessStore()
const scrollContainer = ref<HTMLElement | null>(null)

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
 * 点击返回按钮
 */
function onClickBack() {
  router.back()
}

/**
 * 点击刷新按钮
 */
function onClickRefresh() {
  emitter.emit("process:refresh")
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
 * 右键菜单命令处理
 */
function onContextMenuCommand(command: string, item: ProcessItem, index: number) {
  switch (command) {
    case "close":
      onClickClose(index)
      break
    case "closeOther":
      processStore.removeOther(item)
      router.push(item.fullPath)
      break
    case "closeAll":
      processStore.clear()
      router.push("/")
      break
  }
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

// 路由变化时滚动到激活标签
watch(
  () => route.path,
  () => {
    scrollToActive()
  },
)

// 初始化时滚动到激活标签
onMounted(() => {
  scrollToActive()
})
</script>

<style lang="scss" scoped>
.process {
  height: $tags-view-height;
  display: flex;
  padding: 0 $spacing-base;
  align-items: center;
  border-bottom: 1px solid $border-light;
  background-color: $bg-white;

  // 导航操作区
  &__nav {
    height: 100%;
    display: flex;
    flex-shrink: 0;
    border-radius: $border-radius-sm;
    background-color: $bg-white;

    .nav-item {
      cursor: pointer;
      height: 100%;
      display: flex;
      padding: 0 $spacing-md;
      position: relative;
      font-size: 14px;
      transition: color $transition-duration;
      align-items: center;
      justify-content: center;

      &:hover {
        color: $primary-color;
      }

      // 分隔线
      &:not(:last-child)::after {
        top: 50%;
        right: 0;
        width: 1px;
        height: 12px;
        content: "";
        position: absolute;
        transform: translateY(-50%);
        background-color: $border-color;
      }
    }
  }

  // 标签列表区
  &__list {
    flex: 1;
    height: 100%;
    overflow: hidden;
    position: relative;
    overflow-x: auto;
    border-radius: $border-radius-sm;

    // 隐藏滚动条
    &::-webkit-scrollbar {
      height: 0;
      display: none;
    }
  }

  &__scroll {
    gap: $spacing-sm;
    height: 100%;
    display: flex;
    position: absolute;
    white-space: nowrap;
  }

  // 标签项
  .process-item {
    gap: $spacing-xs;
    border: 1px solid $border-light;
    border: 1px solid $border-light;
    cursor: pointer;
    height: 100%;
    display: flex;
    padding: 0 $spacing-md;
    font-size: 12px;
    transition: all $transition-duration;
    align-items: center;
    border-radius: 2px;
    background-color: $bg-white;

    &__title {
      overflow: hidden;
      max-width: 120px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__close {
      width: 0;
      opacity: 0;
      font-size: 12px;
      transition: all $transition-duration;

      &:hover {
        color: $danger-color;
      }
    }

    &:hover {
      background-color: $bg-color;

      .process-item__close {
        width: 14px;
        opacity: 1;
      }
    }

    // 激活状态
    &.is-active {
      color: $primary-color;
      border-color: $primary-color;
      background-color: $primary-light-9; // 需要确认是否有这个变量，如果没有则用 primary-light 配合透明度，或者直接用 hex

      .process-item__close {
        width: 14px;
        opacity: 1;
      }
    }
  }
}
</style>
