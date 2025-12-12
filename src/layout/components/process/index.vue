<template>
  <div class="process">
    <!-- 导航操作区 -->
    <div class="process__nav">
      <div class="nav-item" title="返回" @click="onClickBack">
        <icon icon="ri:arrow-left-line" :size="14" />
      </div>
      <div class="nav-item" title="刷新" @click="onClickRefresh">
        <icon icon="ri:refresh-line" :size="14" />
      </div>
      <div class="nav-item" title="首页" @click="onClickHome">
        <icon icon="ri:home-4-line" :size="14" />
      </div>
    </div>

    <!-- 标签列表区 -->
    <div ref="scrollContainer" class="process__list" @wheel="onWheel">
      <div class="process__scroll">
        <el-dropdown v-for="(item, index) in processStore.list" :key="item.path" trigger="contextmenu" @command="(cmd: string) => onContextMenuCommand(cmd, item, index)">
          <div class="process-item" :class="{ 'is-active': item.path === route.path }" @click="onClickItem(item)">
            <span class="process-item__title">{{ item.title }}</span>
            <icon v-if="!item.affix" icon="ri:close-line" :size="14" class="process-item__close" @click.stop="onClickClose(index)" />
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="close" :disabled="item.affix"> 关闭当前 </el-dropdown-item>
              <el-dropdown-item command="closeOther"> 关闭其他 </el-dropdown-item>
              <el-dropdown-item command="closeAll"> 关闭所有 </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

<style lang="scss">
.process {
  display: flex;
  padding: $spacing-xs $spacing-md;
  align-items: center;
  background-color: var(--el-bg-color);

  // 导航操作区
  &__nav {
    height: 100%;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: $spacing-md;

    .nav-item {
      width: 30px;
      border: 1px solid var(--el-fill-color-dark);
      cursor: pointer;
      height: 30px;
      display: flex;
      transition: all 0.2s ease-in-out;
      align-items: center;
      margin-right: $spacing-xs;
      border-radius: 6px;
      justify-content: center;

      &:hover {
        border-color: var(--el-color-primary);
        background-color: transparent;
      }

      &:last-child {
        margin-right: 0;
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

  &__scroll {
    gap: $spacing-xs;
    height: 100%;
    display: flex;
    padding: 4px 0;
    align-items: center;
  }

  // 标签项
  .process-item {
    gap: $spacing-xs;
    color: $text-regular;
    border: 1px solid var(--el-fill-color-dark);
    cursor: pointer;
    height: 30px;
    display: flex;
    padding: 0 12px;
    position: relative;
    font-size: 12px;
    transition: all 0.2s ease-in-out;
    align-items: center;
    border-radius: 4px;
    background-color: transparent;

    &__title {
      overflow: hidden;
      max-width: 120px;
      transition: margin-right 0.2s ease-in-out;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &__close {
      width: 0;
      height: 14px;
      display: flex;
      opacity: 0;
      overflow: hidden;
      font-size: 10px;
      transition: all 0.2s ease-in-out;
      align-items: center;
      flex-shrink: 0;
      border-radius: 50%;
      pointer-events: none;
      justify-content: center;

      &:hover {
        color: var(--el-color-primary);
        background-color: var(--el-color-primary-light-7);
      }
    }

    // hover 状态
    &:hover {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);

      .process-item__close {
        color: var(--el-text-color-secondary);
        width: 14px;
        opacity: 1;
        pointer-events: auto;

        &:hover {
          color: var(--el-color-primary);
          background-color: var(--el-color-primary-light-7);
        }
      }
    }

    // 激活状态
    &.is-active {
      color: #fff;
      font-weight: 500;
      border-color: var(--el-color-primary);
      background-color: var(--el-color-primary);

      .process-item__close {
        color: #fff;
        width: 14px;
        opacity: 1;
        pointer-events: auto;

        &:hover {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
}
</style>
