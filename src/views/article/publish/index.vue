<template>
  <div class="publish-container h-full flex flex-col">
    <!-- Top Toolbar -->
    <header class="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
      <div class="flex items-center gap-4">
        <el-input
          v-model="articleTitle"
          placeholder="请输入文章标题..."
          class="!text-xl font-bold w-96 title-input"
          :input-style="{ border: 'none', boxShadow: 'none', fontSize: '1.25rem', fontWeight: 600 }"
        />
        <span class="text-xs text-gray-400">
          <span v-if="saving" class="flex items-center gap-1"><el-icon class="is-loading"><loading /></el-icon> 保存中...</span>
          <span v-else>已保存至草稿箱</span>
        </span>
      </div>
      <div class="flex items-center gap-3">
        <el-button plain @click="router.back()">取消</el-button>
        <el-button plain>预览</el-button>
        <el-button type="primary" :loading="publishing" @click="handlePublish">发布文章</el-button>
        <el-button icon="Setting" circle @click="showSettings = !showSettings" />
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- Main Editor Area -->
      <div class="flex-1 overflow-y-auto bg-gray-50 p-6 flex justify-center">
        <div class="w-full max-w-4xl bg-white shadow-sm rounded-lg min-h-[calc(100vh-120px)] p-12">
          <!-- Simulated Toolbar for Rich Text Editor -->
          <div class="sticky top-0 bg-white border-b border-gray-100 pb-4 mb-6 flex gap-2 overflow-x-auto items-center z-10">
            <el-button-group>
              <el-button plain size="small">H1</el-button>
              <el-button plain size="small">H2</el-button>
              <el-button plain size="small">H3</el-button>
            </el-button-group>
            <div class="w-px h-6 bg-gray-200 mx-2"></div>
            <el-button-group>
              <el-button plain size="small" icon="Bold" />
              <el-button plain size="small" icon="Italic" />
              <el-button plain size="small" style="text-decoration: underline">U</el-button>
            </el-button-group>
            <div class="w-px h-6 bg-gray-200 mx-2"></div>
            <el-button-group>
              <el-button plain size="small" icon="Link" />
              <el-button plain size="small" icon="Picture" />
              <el-button plain size="small" icon="VideoCamera" />
            </el-button-group>
            <div class="w-px h-6 bg-gray-200 mx-2"></div>
            <el-button-group>
              <el-button plain size="small">Quote</el-button>
              <el-button plain size="small">Code</el-button>
            </el-button-group>
          </div>

          <el-input
            v-model="content"
            type="textarea"
            :autosize="{ minRows: 20 }"
            placeholder="开始你的创作..."
            class="editor-textarea !border-none !shadow-none !text-lg text-gray-700 leading-relaxed"
            :input-style="{ border: 'none', boxShadow: 'none', resize: 'none' }"
          />
        </div>
      </div>

      <!-- Right Settings Sidebar -->
      <transition name="el-fade-in-linear">
        <div v-if="showSettings" class="w-80 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
          <div class="p-4 border-b border-gray-100 font-medium text-gray-700">文章设置</div>

          <div class="p-4 space-y-6">
            <!-- Cover Image -->
            <div>
              <div class="text-sm font-medium text-gray-600 mb-2">文章封面</div>
              <el-upload
                class="avatar-uploader"
                action="#"
                :show-file-list="false"
              >
                <div v-if="coverUrl" class="w-full h-40 rounded-lg bg-cover bg-center border border-gray-200" :style="{ backgroundImage: `url(${coverUrl})` }"></div>
                <div v-else class="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer bg-gray-50">
                  <el-icon class="text-2xl mb-1"><plus /></el-icon>
                  <span class="text-xs">点击上传封面</span>
                </div>
              </el-upload>
            </div>

            <!-- Category -->
            <div>
              <div class="text-sm font-medium text-gray-600 mb-2">分类专栏</div>
              <el-select v-model="category" placeholder="请选择分类" class="w-full">
                <el-option label="前端开发" value="frontend" />
                <el-option label="后端架构" value="backend" />
                <el-option label="AI 技术" value="ai" />
                <el-option label="各种杂谈" value="talk" />
              </el-select>
            </div>

            <!-- Tags -->
            <div>
              <div class="text-sm font-medium text-gray-600 mb-2">文章标签</div>
              <el-select
                v-model="tags"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="选择或输入标签"
                class="w-full"
              >
                <el-option label="Vue3" value="Vue3" />
                <el-option label="React" value="React" />
                <el-option label="TypeScript" value="TypeScript" />
              </el-select>
            </div>

            <!-- Summary -->
            <div>
              <div class="text-sm font-medium text-gray-600 mb-2">文章摘要</div>
              <el-input
                v-model="summary"
                type="textarea"
                :rows="4"
                maxlength="200"
                show-word-limit
                placeholder="请输入文章摘要（默认截取正文前200字）"
              />
            </div>

            <!-- Visibility -->
            <div>
              <div class="text-sm font-medium text-gray-600 mb-2">发布设置</div>
              <el-radio-group v-model="visibility" class="flex flex-col items-start gap-2">
                <el-radio label="public">公开可见</el-radio>
                <el-radio label="password">密码保护</el-radio>
                <el-radio label="private">私密（仅自己可见）</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ElMessage } from "element-plus"
import { useRouter } from "vue-router"
import { Plus, Loading } from "@element-plus/icons-vue"

const router = useRouter()

const articleTitle = ref("Vue3 + TypeScript + Vite 现代化前端工程最佳实践探索")
const content = ref(`随着前端工程化的快速发展，如何构建一个高效、可维护且具备良好开发体验的项目脚手架成为了每个团队需要面对的挑战。本文将结合实际项目经验，分享一套基于 Vue3 生态的现代化工程搭建方案。

# 1. 技术选型思考

在选择技术栈时，我们主要考虑了以下几个核心维度：

- 开发体验 (DX): Vite 带来的毫秒级热更新体验。
- 类型安全: TypeScript 全面覆盖，减少运行时错误。
- 生态成熟度: Vue3 setup 语法糖 + Pinia 状态管理。
- 样式解决方案: UnoCSS 带来的原子化 CSS 极致体验。

> 技术选型没有绝对的最好，只有最适合当前团队和业务场景的方案。`)

const saving = ref(false)
const publishing = ref(false)
const showSettings = ref(true)
const category = ref("frontend")
const tags = ref(["Vue3", "TypeScript"])
const summary = ref("本文深入探讨了在大型项目中应用 Vue3 Composition API 的设计模式与最佳实践...")
const visibility = ref("public")
const coverUrl = ref("https://picsum.photos/seed/article-cover/400/200")

function handlePublish() {
  publishing.value = true
  setTimeout(() => {
    publishing.value = false
    ElMessage.success("发布成功！")
    router.push("/article/list")
  }, 1000)
}
</script>

<style scoped>
:deep(.el-textarea__inner) {
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;
  box-shadow: none !important;
}

.title-input :deep(.el-input__inner) {
  height: 2.5rem;
}
</style>
