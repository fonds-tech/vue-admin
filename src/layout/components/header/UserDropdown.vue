<template>
  <el-dropdown>
    <div class="user-info">
      <el-avatar :size="28" :src="userInfo.avatar || ''">
        {{ userInfo.nickname?.charAt(0) || "A" }}
      </el-avatar>
      <span class="user-name">{{ userInfo.nickname || "管理员" }}</span>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="goProfile">
          <el-icon><User /></el-icon>
          {{ $t("header.profile") }}
        </el-dropdown-item>
        <el-dropdown-item @click="openSettings">
          <el-icon><Setting /></el-icon>
          {{ $t("header.settings") }}
        </el-dropdown-item>
        <el-dropdown-item divided @click="handleLogout">
          <el-icon><SwitchButton /></el-icon>
          {{ $t("header.logout") }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
/**
 * 用户下拉菜单组件
 */
import { useI18n } from "vue-i18n"
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"
import { ElMessageBox } from "element-plus"

const emit = defineEmits<{
  openSettings: []
}>()

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

/** 用户信息 */
const userInfo = computed(() => userStore.userInfo)

/** 跳转个人中心 */
function goProfile() {
  router.push("/profile")
}

/** 打开设置 */
function openSettings() {
  emit("openSettings")
}

/** 退出登录 */
async function handleLogout() {
  try {
    await ElMessageBox.confirm(t("header.logoutConfirm"), t("common.confirm"), {
      type: "warning",
    })
    userStore.logout()
    router.push("/login")
  }
  catch {
    // 用户取消
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  gap: $spacing-sm;
  cursor: pointer;
  display: flex;
  padding: 4px 8px;
  transition: background-color $transition-duration;
  align-items: center;
  border-radius: $border-radius;

  &:hover {
    background-color: var(--el-fill-color-light);
  }

  .user-name {
    overflow: hidden;
    font-size: 14px;
    max-width: 100px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

:deep(.el-dropdown-menu__item) {
  .el-icon {
    margin-right: 8px;
  }
}
</style>
