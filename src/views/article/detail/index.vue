<template>
  <div class="article-detail-container p-4 max-w-5xl mx-auto">
    <el-button link class="mb-4" icon="ArrowLeft" @click="router.back()">返回列表</el-button>

    <div class="flex gap-6">
      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <el-card shadow="never" class="article-content-card">
          <!-- Article Header -->
          <header class="mb-8 pb-8 border-b border-gray-100">
            <div class="flex items-center gap-2 mb-4">
              <el-tag effect="dark" type="primary">原创</el-tag>
              <el-tag effect="plain" type="success">前端开发</el-tag>
            </div>

            <h1 class="text-3xl font-bold text-gray-900 mb-6 leading-tight">
              Vue3 + TypeScript + Vite 现代化前端工程最佳实践探索
            </h1>

            <div class="flex items-center justify-between text-gray-500 text-sm">
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                  <el-avatar :size="32" src="https://i.pravatar.cc/150?u=editor" />
                  <span class="font-medium text-gray-700">TechLead_Alex</span>
                </div>
                <span>2024-03-21 14:30</span>
                <span>字数 4.2k</span>
                <span>阅读 12m</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1"><el-icon><view /></el-icon> 8,234</span>
                <span class="flex items-center gap-1"><el-icon><star /></el-icon> 542</span>
              </div>
            </div>
          </header>

          <!-- Article Body (Simulated Rich Text) -->
          <article class="prose prose-slate max-w-none mb-12">
            <p class="lead text-xl text-gray-600 mb-6">
              随着前端工程化的快速发展，如何构建一个高效、可维护且具备良好开发体验的项目脚手架成为了每个团队需要面对的挑战。本文将结合实际项目经验，分享一套基于 Vue3 生态的现代化工程搭建方案。
            </p>

            <img
              src="https://picsum.photos/seed/article-banner/800/400"
              alt="Article Banner"
              class="w-full rounded-lg mb-8 shadow-sm"
            />

            <h2>1. 技术选型思考</h2>
            <p>
              在选择技术栈时，我们主要考虑了以下几个核心维度：
            </p>
            <ul>
              <li><strong>开发体验 (DX)</strong>: Vite 带来的毫秒级热更新体验。</li>
              <li><strong>类型安全</strong>: TypeScript 全面覆盖，减少运行时错误。</li>
              <li><strong>生态成熟度</strong>: Vue3 setup 语法糖 + Pinia 状态管理。</li>
              <li><strong>样式解决方案</strong>: UnoCSS 带来的原子化 CSS 极致体验。</li>
            </ul>

            <blockquote>
              <p>技术选型没有绝对的最好，只有最适合当前团队和业务场景的方案。</p>
            </blockquote>

            <h2>2. 核心架构设计</h2>
            <p>
              我们采用了 monorepo 策略来管理基础库和业务代码...
            </p>

            <h3>2.1 目录结构规范</h3>
            <pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>src/
  ├── api/           # API 接口层
  ├── assets/        # 静态资源
  ├── components/    # 通用组件
  ├── hooks/         # 组合式函数
  ├── store/         # 状态仓库
  ├── views/         # 页面视图
  └── utils/         # 工具函数</code></pre>

            <h2>3. 性能优化实践</h2>
            <p>
              在性能优化方面，我们主要关注首屏加载速度和运行时性能...
            </p>
          </article>

          <!-- Article Footer: Tags & Actions -->
          <div class="flex items-center justify-between pt-8 border-t border-gray-100 mb-8">
            <div class="flex gap-2">
              <el-tag v-for="tag in ['Vue3', 'Project', 'Engineering']" :key="tag" type="info" effect="plain" round>
                # {{ tag }}
              </el-tag>
            </div>
            <div class="flex gap-4">
              <el-button type="primary" plain round icon="Pointer">
                点赞 (542)
              </el-button>
              <el-button type="warning" plain round icon="Star">
                收藏 (1.2k)
              </el-button>
              <el-button plain round icon="Share">
                分享
              </el-button>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="bg-gray-50 p-6 rounded-xl">
            <h3 class="text-lg font-bold mb-6 flex items-center gap-2">
              评论 <span class="text-gray-400 text-sm font-normal">(128)</span>
            </h3>

            <!-- Comment Input -->
            <div class="flex gap-4 mb-8">
              <el-avatar :size="40" src="https://i.pravatar.cc/150?u=user" />
              <div class="flex-1">
                <el-input
                  v-model="commentContent"
                  type="textarea"
                  :rows="3"
                  placeholder="写下你的评论..."
                  resize="none"
                  class="mb-2"
                />
                <div class="flex justify-end">
                  <el-button type="primary">发布评论</el-button>
                </div>
              </div>
            </div>

            <!-- Comment List -->
            <div class="space-y-6">
              <div v-for="i in 3" :key="i" class="flex gap-4 group">
                <el-avatar :size="40" :src="`https://i.pravatar.cc/150?u=${i + 10}`" />
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-1">
                    <div>
                      <span class="font-medium text-gray-800 mr-2">User_{{ i }}</span>
                      <span class="text-xs text-gray-400">2 小时前</span>
                    </div>
                    <el-button link type="info" size="small" class="opacity-0 group-hover:opacity-100 transition-opacity">
                      回复
                    </el-button>
                  </div>
                  <p class="text-gray-600 text-sm leading-relaxed">
                    这篇文章写得太好了，尤其是关于目录结构规范的部分，对我们团队很有参考价值！希望能多出一些关于性能优化的实战案例。
                  </p>
                </div>
              </div>
            </div>

            <div class="text-center mt-6">
              <el-button text type="primary">查看全部评论</el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- Right Toc (Table of Contents) -->
      <div class="w-64 hidden xl:block flex-shrink-0">
        <div class="sticky top-4">
          <el-card shadow="never" class="mb-4">
            <div class="flex items-center gap-4 mb-4">
              <el-avatar :size="48" src="https://i.pravatar.cc/150?u=editor" />
              <div>
                <div class="font-medium">TechLead_Alex</div>
                <div class="text-xs text-gray-500">资深前端架构师</div>
              </div>
            </div>
            <div class="flex justify-between text-center border-t border-gray-100 pt-4">
              <div>
                <div class="font-bold text-gray-800">128</div>
                <div class="text-xs text-gray-500">文章</div>
              </div>
              <div>
                <div class="font-bold text-gray-800">12k</div>
                <div class="text-xs text-gray-500">粉丝</div>
              </div>
              <div>
                <div class="font-bold text-gray-800">54k</div>
                <div class="text-xs text-gray-500">获赞</div>
              </div>
            </div>
            <el-button class="w-full mt-4" type="primary" plain>关注作者</el-button>
          </el-card>

          <el-card shadow="never">
            <template #header>
              <span class="font-medium">目录</span>
            </template>
            <el-anchor direction="vertical" :offset="30">
              <el-anchor-link href="#tech" title="1. 技术选型思考" />
              <el-anchor-link href="#arch" title="2. 核心架构设计" />
              <el-anchor-link href="#perf" title="3. 性能优化实践" />
              <el-anchor-link href="#summary" title="4. 总结与展望" />
            </el-anchor>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Star } from "@element-plus/icons-vue"
import { useRouter } from "vue-router"

const router = useRouter()
const commentContent = ref("")
</script>

<style scoped>
.prose h2 {
  @apply text-xl font-bold text-gray-800 mt-8 mb-4;
}

.prose h3 {
  @apply text-lg font-bold text-gray-700 mt-6 mb-3;
}

.prose p {
  @apply text-gray-600 leading-7 mb-4;
}

.prose ul {
  @apply list-disc list-inside mb-4 text-gray-600;
}

.prose blockquote {
  @apply border-l-4 border-primary bg-primary/10 p-4 rounded-r mb-6 italic text-gray-700;
}
</style>
