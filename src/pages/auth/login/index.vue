<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 左侧装饰 -->
      <div class="login-banner">
        <div class="banner-content">
          <h1>Vue Admin</h1>
          <p>基于 Vue3 + TypeScript + Element Plus 的现代化后台管理系统</p>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-form-wrapper">
        <div class="login-form">
          <h2 class="login-title">{{ t("login.title") }}</h2>

          <el-form ref="formRef" :model="form" :rules="rules" size="large">
            <el-form-item prop="username">
              <el-input v-model="form.username" :placeholder="t('login.usernamePlaceholder')" prefix-icon="User" />
            </el-form-item>

            <el-form-item prop="password">
              <el-input v-model="form.password" type="password" :placeholder="t('login.passwordPlaceholder')" prefix-icon="Lock" show-password @keyup.enter="handleLogin" />
            </el-form-item>

            <el-form-item>
              <div class="form-options">
                <el-checkbox v-model="form.remember">{{ t("login.remember") }}</el-checkbox>
                <a href="#" class="forgot-link">忘记密码？</a>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
                {{ t("login.login") }}
              </el-button>
            </el-form-item>
          </el-form>

          <div class="login-tips">
            <p>管理员：admin / 123456</p>
            <p>普通用户：user / 123456</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 登录页面
 */
import { useI18n } from "vue-i18n"
import { ElMessage } from "element-plus"
import { useAppStore } from "@/stores/app"
import { useUserStore } from "@/stores/user"
import { ref, reactive } from "vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const appStore = useAppStore()
const userStore = useUserStore()

const loading = ref(false)
const formRef = ref()

const form = reactive({
  username: "admin",
  password: "123456",
  remember: true,
})

const rules = {
  username: [{ required: true, message: () => t("common.required"), trigger: "blur" }],
  password: [{ required: true, message: () => t("common.required"), trigger: "blur" }],
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    await userStore.login(form.username, form.password)
    appStore.setToken("123456")
    appStore.setRefreshToken("123456")
    ElMessage.success(t("common.success"))

    // 跳转到来源页面或首页
    const redirect = (route.query.redirect as string) || "/"
    router.push(redirect)
  } catch {
    ElMessage.error(t("common.failed"))
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  display: flex;
  width: 900px;
  overflow: hidden;
  background: $bg-white;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-lg;
}

.login-banner {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl;
  color: #fff;
  background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);

  .banner-content {
    text-align: center;

    h1 {
      margin-bottom: $spacing-base;
      font-size: 32px;
      font-weight: 700;
    }

    p {
      font-size: 14px;
      line-height: 1.6;
      opacity: 0.9;
    }
  }
}

.login-form-wrapper {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: $spacing-2xl;
}

.login-form {
  width: 100%;
  max-width: 320px;

  .login-title {
    margin-bottom: $spacing-xl;
    font-size: 24px;
    font-weight: 600;
    color: $text-primary;
    text-align: center;
  }

  .form-options {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .forgot-link {
    font-size: 13px;
    color: $primary-color;
  }

  .login-btn {
    width: 100%;
  }

  .login-tips {
    padding-top: $spacing-base;
    font-size: 12px;
    color: $text-secondary;
    text-align: center;
  }
}

@media (width <= 768px) {
  .login-container {
    flex-direction: column;
    width: 90%;
    max-width: 400px;
  }

  .login-banner {
    padding: $spacing-xl;

    .banner-content h1 {
      font-size: 24px;
    }
  }
}
</style>
