<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
/**
 * 根组件
 */
import { useAppStore } from "./stores/app"
import { ElConfigProvider } from "element-plus"
import { elementPlusLocales } from "./locales"

const appStore = useAppStore()
const locale = elementPlusLocales[appStore.language as keyof typeof elementPlusLocales]
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
