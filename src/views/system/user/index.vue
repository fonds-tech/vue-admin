<template>
  <div class="page-container">
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="tableData" border stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="username" label="用户名" min-width="100" />
        <el-table-column prop="nickname" label="昵称" min-width="100" />
        <el-table-column prop="email" label="邮箱" min-width="160" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="pagination" :total="tableData.length" :page-size="10" layout="total, prev, pager, next" />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="!!form.id" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item v-if="!form.id" label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 用户管理页面
 */
import { ref, reactive } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"

// 搜索表单
const searchForm = reactive({
  username: "",
  status: "",
})

// 表格数据
const tableData = ref([
  {
    id: 1,
    username: "admin",
    nickname: "管理员",
    email: "admin@example.com",
    status: 1,
    createTime: "2024-01-01 00:00:00",
  },
  {
    id: 2,
    username: "user",
    nickname: "普通用户",
    email: "user@example.com",
    status: 1,
    createTime: "2024-01-02 00:00:00",
  },
  {
    id: 3,
    username: "guest",
    nickname: "访客",
    email: "guest@example.com",
    status: 0,
    createTime: "2024-01-03 00:00:00",
  },
])

const loading = ref(false)

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref("新增用户")
const formRef = ref()
const form = reactive({
  id: 0,
  username: "",
  nickname: "",
  email: "",
  password: "",
  status: 1,
})

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
}

function handleSearch() {
  ElMessage.info("搜索功能开发中")
}

function handleReset() {
  searchForm.username = ""
  searchForm.status = ""
}

function handleAdd() {
  dialogTitle.value = "新增用户"
  Object.assign(form, { id: 0, username: "", nickname: "", email: "", password: "", status: 1 })
  dialogVisible.value = true
}

function handleEdit(row: (typeof tableData.value)[0]) {
  dialogTitle.value = "编辑用户"
  Object.assign(form, { ...row, password: "" })
  dialogVisible.value = true
}

async function handleDelete(row: (typeof tableData.value)[0]) {
  await ElMessageBox.confirm("确定删除该用户吗？", "提示", { type: "warning" })
  tableData.value = tableData.value.filter(item => item.id !== row.id)
  ElMessage.success("删除成功")
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  if (form.id) {
    const row = tableData.value.find(item => item.id === form.id)
    if (row) {
      // 只更新表单中存在的字段
      row.username = form.username
      row.nickname = form.nickname
      row.email = form.email
      row.status = form.status
    }
  }
  else {
    tableData.value.push({
      id: Date.now(),
      username: form.username,
      nickname: form.nickname,
      email: form.email,
      status: form.status,
      createTime: new Date().toLocaleString(),
    })
  }

  dialogVisible.value = false
  ElMessage.success("保存成功")
}
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.search-card {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.table-card {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: $spacing-base;
  }
}
</style>
