<template>
  <div class="comment-manager p-4">
    <el-card shadow="never">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="font-medium text-lg">评论管理</span>
          <div class="flex gap-4">
            <el-radio-group v-model="filterStatus" size="default">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="pending">待审核</el-radio-button>
              <el-radio-button label="approved">已发布</el-radio-button>
              <el-radio-button label="spam">垃圾评论</el-radio-button>
            </el-radio-group>

            <el-input v-model="searchQuery" placeholder="搜索评论内容/作者..." style="width: 200px" prefix-icon="Search" />
          </div>
        </div>
      </template>

      <el-table :data="comments" style="width: 100%" stripe>
        <el-table-column label="评论者" width="200">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <el-avatar :size="32" :src="row.avatar" />
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-800">{{ row.author }}</span>
                <span class="text-xs text-gray-400">{{ row.email }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="评论内容" min-width="300">
          <template #default="{ row }">
            <div class="py-2">
              <div class="text-xs text-gray-400 mb-1">
                评论于 <span class="text-primary cursor-pointer hover:underline">《{{ row.articleTitle }}》</span>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2">{{ row.content }}</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="时间" width="180" prop="time" />

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-button v-if="row.status === 'pending'" link type="primary" size="small">通过</el-button>
              <el-button link type="primary" size="small">回复</el-button>
              <el-dropdown>
                <span class="el-dropdown-link ml-2">
                  <el-icon class="text-gray-400 cursor-pointer hover:text-primary"><more-filled /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="row.status !== 'spam'">标记垃圾</el-dropdown-item>
                    <el-dropdown-item class="text-red-500">删除评论</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="flex justify-end mt-4">
        <el-pagination background layout="prev, pager, next" :total="100" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { MoreFilled } from "@element-plus/icons-vue"

const filterStatus = ref("all")
const searchQuery = ref("")

function getStatusType(status: string) {
  const map: Record<string, "success" | "warning" | "danger" | "info"> = {
    approved: "success",
    pending: "warning",
    spam: "danger",
  }
  return map[status] || "info"
}

function getStatusText(status: string) {
  const map: Record<string, string> = {
    approved: "已发布",
    pending: "待审核",
    spam: "垃圾",
  }
  return map[status] || "未知"
}

// Mock Data
const comments = Array.from({ length: 10 }).map((_, i) => ({
  id: i,
  author: ["Alice", "Bob", "Charlie", "David", "Eva"][i % 5],
  email: `user${i}@example.com`,
  avatar: `https://i.pravatar.cc/150?u=${i + 20}`,
  content:
    i % 2 === 0
      ? "这篇文章写得非常好，对我帮助很大！特别是其中关于架构设计的部分，给了我很多启发。"
      : "请问作者，文中的代码示例在哪里可以下载？遇到了一些运行报错的问题，希望能得到解答。",
  articleTitle: i % 3 === 0 ? "Vue3 最佳实践" : "React Hooks 详解",
  status: ["approved", "pending", "approved", "spam", "pending"][i % 5],
  time: "2024-03-21 15:30:22",
}))
</script>
