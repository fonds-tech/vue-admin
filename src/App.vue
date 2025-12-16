<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { useSettingsStore } from "./stores/settings"
import { ElConfigProvider } from "element-plus"
import { elementPlusLocales } from "./locales"

const settingsStore = useSettingsStore()
const locale = elementPlusLocales[settingsStore.language as keyof typeof elementPlusLocales]
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
