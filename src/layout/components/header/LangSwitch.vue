<template>
  <el-dropdown @command="changeLanguage">
    <el-icon class="header-icon-btn">
      <Document />
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh-CN" :class="{ 'is-active': locale === 'zh-CN' }">
          简体中文
        </el-dropdown-item>
        <el-dropdown-item command="en-US" :class="{ 'is-active': locale === 'en-US' }">
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
/**
 * 语言切换下拉菜单
 */
import { computed } from "vue"
import { useAppStore } from "@/stores/app"

const appStore = useAppStore()

/** 当前语言 */
const locale = computed(() => appStore.language)

/** 切换语言 */
function changeLanguage(lang: string) {
  appStore.setLanguage(lang)
  window.location.reload()
}
</script>

<style lang="scss" scoped>
:deep(.is-active) {
  color: $primary-color;
}
</style>
