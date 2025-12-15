<template>
  <div class="article-list-container p-4">
    <el-row :gutter="20">
      <!-- Left Content: Article List -->
      <el-col :span="18" :xs="24">
        <el-card shadow="never" class="mb-4">
          <div class="flex items-center justify-between mb-4">
            <el-tabs v-model="activeTab" class="flex-1">
              <el-tab-pane label="最新发布" name="latest" />
              <el-tab-pane label="热门推荐" name="hot" />
              <el-tab-pane label="本周最火" name="weekly" />
            </el-tabs>
            <div class="w-64">
              <el-input
                v-model="searchQuery"
                placeholder="搜索文章..."
                prefix-icon="Search"
                clearable
              />
            </div>
          </div>

          <div class="article-items">
            <div
              v-for="item in articleList"
              :key="item.id"
              class="article-item py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2 rounded-lg cursor-pointer"
              @click="router.push('/article/detail')"
            >
              <div class="flex gap-4">
                <!-- Cover Image -->
                <div class="w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    :src="item.cover"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    alt="cover"
                  />
                </div>

                <!-- Content -->
                <div class="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="text-lg font-medium text-gray-800 hover:text-primary mb-2 line-clamp-1">
                      {{ item.title }}
                    </h3>
                    <p class="text-gray-500 text-sm line-clamp-2 h-10 mb-2">
                      {{ item.summary }}
                    </p>
                  </div>

                  <div class="flex items-center justify-between text-xs text-gray-400">
                    <div class="flex items-center gap-4">
                      <div class="flex items-center gap-1">
                        <el-avatar :size="20" :src="item.authorAvatar" />
                        <span class="text-gray-600">{{ item.author }}</span>
                      </div>
                      <span>{{ item.publishTime }}</span>
                      <div class="flex gap-1">
                        <el-tag
                          v-for="tag in item.tags"
                          :key="tag"
                          size="small"
                          type="info"
                          effect="plain"
                        >
                          {{ tag }}
                        </el-tag>
                      </div>
                    </div>

                    <div class="flex items-center gap-4">
                      <span class="flex items-center gap-1">
                        <el-icon><view /></el-icon> {{ item.views }}
                      </span>
                      <span class="flex items-center gap-1">
                        <el-icon><chat-dot-square /></el-icon> {{ item.comments }}
                      </span>
                      <span class="flex items-center gap-1">
                        <el-icon><star /></el-icon> {{ item.likes }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center mt-6">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="100"
            />
          </div>
        </el-card>
      </el-col>

      <!-- Right Sidebar -->
      <el-col :span="6" :xs="24" class="hidden-xs-only">
        <!-- Action Card -->
        <el-card shadow="hover" class="mb-4 text-center">
          <div class="py-4">
            <div class="text-gray-500 mb-4">分享你的知识与见解</div>
            <el-button type="primary" class="w-full" icon="Edit" @click="router.push('/article/publish')">
              发布文章
            </el-button>
          </div>
        </el-card>

        <!-- Categories -->
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="flex justify-between items-center">
              <span>文章分类</span>
              <el-button link type="primary" size="small">更多</el-button>
            </div>
          </template>
          <div class="flex flex-col gap-2">
            <div v-for="cat in categories" :key="cat.name" class="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" :class="cat.color"></span>
                <span>{{ cat.name }}</span>
              </div>
              <span class="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-500">{{ cat.count }}</span>
            </div>
          </div>
        </el-card>

        <!-- Tags -->
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <span>热门标签</span>
          </template>
          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="tag in tags"
              :key="tag"
              class="cursor-pointer hover:opacity-80"
              :type="getRandomType()"
              effect="light"
            >
              {{ tag }}
            </el-tag>
          </div>
        </el-card>

        <!-- Trending -->
        <el-card shadow="hover">
          <template #header>
            <span>热门文章</span>
          </template>
          <div class="flex flex-col gap-4">
            <div v-for="(article, index) in trendingArticles" :key="article.id" class="flex gap-3 cursor-pointer group">
              <span
                class="w-5 h-5 flex items-center justify-center rounded text-xs font-bold"
                :class="index < 3 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'"
              >
                {{ index + 1 }}
              </span>
              <div class="flex-1">
                <div class="text-sm text-gray-800 group-hover:text-primary line-clamp-2 transition-colors">
                  {{ article.title }}
                </div>
                <div class="text-xs text-gray-400 mt-1">{{ article.views }} 阅读</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { Star, ChatDotSquare } from "@element-plus/icons-vue"

const router = useRouter()
const activeTab = ref("latest")
const searchQuery = ref("")

const categories = [
  { name: "前端开发", count: 120, color: "bg-blue-500" },
  { name: "后端架构", count: 85, color: "bg-green-500" },
  { name: "AI 技术", count: 64, color: "bg-purple-500" },
  { name: "产品设计", count: 42, color: "bg-orange-500" },
  { name: "DevOps", count: 38, color: "bg-gray-500" },
]

const tags = ["Vue3", "React", "TypeScript", "Node.js", "Spring Boot", "K8s", "ChatGPT", "UI/UX", "Performance"]

function getRandomType() {
  const types: Array<"primary" | "success" | "info" | "warning" | "danger"> = ["primary", "success", "info", "warning", "danger"]
  return types[Math.floor(Math.random() * types.length)]
}

// Mock Data
const articleList = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: [
    "Vue3 组合式 API 最佳实践指南",
    "深入理解 TypeScript 泛型应用",
    "2024 年前端技术趋势展望",
    "Spring Boot 3.0 核心特性解析",
    "基于 WebGPU 的高性能图形渲染",
    "微前端架构落地实战分享",
  ][i],
  summary: "本文深入探讨了在大型项目中应用 Vue3 Composition API 的设计模式与最佳实践，包含了状态管理、逻辑复用以及性能优化等多个维度的详细分析...",
  cover: `https://picsum.photos/seed/${i + 10}/400/300`,
  author: ["Alex", "Sarah", "Mike", "John", "Emma", "David"][i],
  authorAvatar: `https://i.pravatar.cc/150?u=${i}`,
  publishTime: "2 小时前",
  tags: [tags[i], tags[i + 1]],
  views: 1200 + i * 100,
  comments: 45 + i,
  likes: 89 + i * 2,
}))

const trendingArticles = articleList.slice(0, 5)
</script>

<style scoped>
.article-list-container {
  min-height: 100%;
}
</style>
