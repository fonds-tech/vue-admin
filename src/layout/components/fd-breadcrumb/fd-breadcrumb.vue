<template>
  <el-breadcrumb class="fd-breadcrumb" :separator-icon="ArrowRight">
    <transition-group name="breadcrumb-fade">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
        <span v-if="index < breadcrumbs.length - 1" class="fd-breadcrumb__link" @click="handleClick(item)">
          {{ item.title }}
        </span>
        <span v-else class="fd-breadcrumb__current">
          {{ item.title }}
        </span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { ArrowRight } from "@element-plus/icons-vue"
import { useRoute, useRouter } from "vue-router"

defineOptions({ name: "fd-breadcrumb" })

// ===================== 常量 =====================
/** 首页路径 */
const HOME_PATH = "/dashboard"
/** 首页标题 */
const HOME_TITLE = "首页"

// ===================== 路由相关 =====================
const route = useRoute()
const router = useRouter()

/** 面包屑项类型 */
interface BreadcrumbItem {
  path: string
  title: string
}

/**
 * 计算面包屑数据
 * 从 route.matched 中提取非隐藏的路由记录
 */
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const matched = route.matched

  // 过滤并映射路由记录
  const items = matched
    .filter((record) => {
      // 过滤掉隐藏的路由和 Layout 根路由
      return !record.meta?.hidden && record.meta?.title
    })
    .map((record) => ({
      path: record.path,
      title: record.meta?.title as string,
    }))

  // 如果第一项不是首页，则在开头添加首页
  if (items.length > 0 && items[0]?.path !== HOME_PATH) {
    items.unshift({
      path: HOME_PATH,
      title: HOME_TITLE,
    })
  }

  // 如果没有任何项，至少显示首页
  if (items.length === 0) {
    return [
      {
        path: HOME_PATH,
        title: HOME_TITLE,
      },
    ]
  }

  return items
})

/**
 * 处理面包屑点击
 */
function handleClick(item: BreadcrumbItem) {
  if (item.path && item.path !== route.path) {
    router.push(item.path)
  }
}
</script>

<style lang="scss" scoped>
.fd-breadcrumb {
  display: flex;
  align-items: center;

  // 面包屑项容器
  :deep(.el-breadcrumb__inner) {
    display: flex;
    align-items: center;
  }

  // 可点击的链接
  &__link {
    color: var(--el-text-color-regular);
    cursor: pointer;
    transition: color 0.2s ease;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  // 当前页面（不可点击）
  &__current {
    color: var(--el-text-color-primary);
    font-weight: 500;
  }
}

// 过渡动画
.breadcrumb-fade-enter-active,
.breadcrumb-fade-leave-active {
  transition: all 0.3s ease;
}

.breadcrumb-fade-enter-from,
.breadcrumb-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.breadcrumb-fade-move {
  transition: transform 0.3s ease;
}
</style>
