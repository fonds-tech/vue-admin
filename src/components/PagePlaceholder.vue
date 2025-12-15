<template>
  <div class="placeholder-page">
    <el-result
      class="placeholder-result"
      :icon="iconType"
      :title="title"
      :sub-title="descriptionText"
    />

    <el-row :gutter="12" class="placeholder-actions">
      <el-col v-for="(action, index) in actionList" :key="action" :xs="24" :sm="8">
        <el-card shadow="never" class="action-card">
          <div class="action-index">步骤 {{ index + 1 }}</div>
          <div class="action-title">{{ action }}</div>
          <p class="action-desc">根据业务将此步骤落地到组件或接口中</p>
        </el-card>
      </el-col>
    </el-row>

    <el-card v-if="tipList.length" shadow="never" class="tips-card">
      <template #header>快速提示</template>
      <el-timeline>
        <el-timeline-item
          v-for="(tip, index) in tipList"
          :key="tip"
          :type="timelineType"
          :timestamp="`提示 ${index + 1}`"
        >
          {{ tip }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    actions?: string[]
    tips?: string[]
    status?: "info" | "success" | "warning" | "error"
  }>(),
  {
    description: "",
    actions: () => [],
    tips: () => [],
    status: "info",
  },
)

const defaultActions = [
  "梳理业务字段与接口",
  "补充页面布局（表格、卡片或表单）",
  "配置权限、校验与加载状态",
]

const defaultTips = [
  "当前为占位内容，可替换为真实接口数据",
  "保持组件拆分，方便复用与维护",
  "完善异常兜底与空状态，提升可用性",
]

const iconType = computed(() => {
  switch (props.status) {
    case "success":
      return "success"
    case "warning":
      return "warning"
    case "error":
      return "error"
    default:
      return "info"
  }
})

const descriptionText = computed(() =>
  props.description
    ? props.description
    : `「${props.title}」页面正在建设中，可在此补充业务模块、数据统计或操作入口。`,
)

const actionList = computed(() =>
  props.actions.length ? props.actions : defaultActions,
)

const tipList = computed(() => (props.tips.length ? props.tips : defaultTips))

const timelineType = computed(() =>
  props.status === "error" ? "danger" : props.status,
)
</script>

<style scoped lang="scss">
.placeholder-page {
  gap: 12px;
  display: flex;
  padding: 12px;
  flex-direction: column;
}

.placeholder-result {
  border: 1px dashed var(--el-border-color);
  background: var(--el-fill-color-lighter);
  border-radius: 8px;
}

.placeholder-actions {
  .action-card {
    height: 100%;
    border-radius: 8px;

    .action-index {
      color: var(--el-text-color-secondary);
      font-size: 12px;
      margin-bottom: 4px;
    }

    .action-title {
      color: var(--el-text-color-primary);
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .action-desc {
      color: var(--el-text-color-regular);
      margin: 0;
      line-height: 1.6;
    }
  }
}

.tips-card {
  border-radius: 8px;

  :deep(.el-card__header) {
    font-weight: 600;
  }
}
</style>
