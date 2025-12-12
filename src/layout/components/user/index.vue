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
        <el-dropdown-item @click="emit('openSettings')">
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
import { useI18n } from "vue-i18n"
import { computed } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"
import { ElMessageBox } from "element-plus"

defineOptions({ name: "topbar-user" })

const emit = defineEmits<{
  openSettings: []
}>()

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

function goProfile() {
  router.push("/profile")
}

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
  transition: background-color 0.2s;
  align-items: center;
  border-radius: 6px;

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
