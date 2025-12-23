import type { FormRules, FormInstance } from "element-plus"
import { ElMessage } from "element-plus"
import { ref, reactive } from "vue"

/**
 * 表单配置
 */
export interface FormOptions<T> {
  /** 默认表单数据 */
  defaultData: T
  /** 提交 API（新增） */
  createApi?: (data: T) => Promise<unknown>
  /** 提交 API（编辑） */
  updateApi?: (id: number, data: T) => Promise<unknown>
  /** 提交成功回调 */
  onSuccess?: () => void
}

/**
 * 通用表单 Hook
 * 提供表单验证、提交、重置等功能
 */
export function useForm<T extends object>(options: FormOptions<T>) {
  const { defaultData, createApi, updateApi, onSuccess } = options

  // 表单引用
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive<T & { id?: number }>({ ...defaultData } as T & { id?: number })

  // 加载状态
  const loading = ref(false)

  // 弹窗状态
  const visible = ref(false)

  // 是否编辑模式
  const isEdit = ref(false)

  /**
   * 打开新增弹窗
   */
  function openAdd() {
    isEdit.value = false
    Object.assign(formData, defaultData, { id: undefined })
    visible.value = true
  }

  /**
   * 打开编辑弹窗
   */
  function openEdit(row: T & { id: number }) {
    isEdit.value = true
    Object.assign(formData, row)
    visible.value = true
  }

  /**
   * 关闭弹窗
   */
  function close() {
    visible.value = false
    formRef.value?.resetFields()
  }

  /**
   * 提交表单
   */
  async function submit() {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return

    loading.value = true
    try {
      const data = { ...formData } as T
      if (isEdit.value && formData.id && updateApi) {
        await updateApi(formData.id, data)
        ElMessage.success("更新成功")
      } else if (createApi) {
        await createApi(data)
        ElMessage.success("新增成功")
      }
      close()
      onSuccess?.()
    } catch (error) {
      console.error("提交失败:", error)
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置表单
   */
  function reset() {
    formRef.value?.resetFields()
    Object.assign(formData, defaultData)
  }

  return {
    formRef,
    formData,
    loading,
    visible,
    isEdit,
    openAdd,
    openEdit,
    close,
    submit,
    reset,
  }
}

/**
 * 创建表单验证规则的辅助函数
 */
export function createRequiredRule(message: string, trigger: "blur" | "change" = "blur"): FormRules[string] {
  return [{ required: true, message, trigger }]
}
