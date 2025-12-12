<template>
  <!-- 无子菜单 -->
  <el-menu-item v-if="!menu.children || menu.children.length === 0" :index="fullPath">
    <el-icon v-if="menu.meta?.icon">
      <component :is="menu.meta.icon" />
    </el-icon>
    <template #title>{{ menu.meta?.title }}</template>
  </el-menu-item>

  <!-- 有子菜单 -->
  <el-sub-menu v-else :index="fullPath">
    <template #title>
      <el-icon v-if="menu.meta?.icon">
        <component :is="menu.meta.icon" />
      </el-icon>
      <span>{{ menu.meta?.title }}</span>
    </template>
    <!-- 递归渲染子菜单 -->
    <sidebar-menu-item
      v-for="child in menu.children"
      :key="child.path"
      :menu="child"
      :base-path="fullPath"
    />
  </el-sub-menu>
</template>

<script setup lang="ts">
/**
 * 侧边栏菜单项组件（递归）
 */
import type { BackendMenu } from "@/stores/permission/interface"
import { computed } from "vue"

defineOptions({ name: "sidebar-menu-item" })

const props = defineProps<{
  /** 菜单项 */
  menu: BackendMenu
  /** 父级路径 */
  basePath: string
}>()

/** 计算完整路径 */
const fullPath = computed(() => {
  // 如果是外链，直接返回
  if (props.menu.path.startsWith("http")) {
    return props.menu.path
  }
  // 拼接父级路径
  return `${props.basePath}/${props.menu.path}`
})
</script>
