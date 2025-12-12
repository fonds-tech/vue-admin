<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">{{ $t("menu.dashboard") }}</el-breadcrumb-item>
    <el-breadcrumb-item v-if="currentTitle && $route.path !== '/dashboard'">
      {{ currentTitle }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
/**
 * 面包屑导航组件
 */
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

/** 当前页面标题 */
const currentTitle = computed(() => route.meta.title as string | undefined)
</script>
