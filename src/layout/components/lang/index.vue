<template>
  <el-dropdown @command="changeLanguage">
    <el-icon class="action-btn">
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
import { computed } from "vue"
import { useAppStore } from "@/stores/app"

defineOptions({ name: "topbar-lang" })

const appStore = useAppStore()

const locale = computed(() => appStore.language)

function changeLanguage(lang: string) {
  appStore.setLanguage(lang)
  window.location.reload()
}
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

:deep(.is-active) {
  color: var(--el-color-primary);
}
</style>
