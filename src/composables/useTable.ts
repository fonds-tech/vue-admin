import type { PageResult } from "@/api/interface"
import { ref, computed, reactive } from "vue"

/**
 * 表格配置
 */
export interface TableOptions<T, Q> {
  /** 获取列表数据的 API 函数 */
  fetchApi: (params: Q) => Promise<PageResult<T>>
  /** 默认查询参数 */
  defaultQuery?: Partial<Q>
  /** 默认分页大小 */
  defaultPageSize?: number
  /** 是否立即加载 */
  immediate?: boolean
}

/**
 * 通用表格 Hook
 * 提供分页、搜索、刷新等通用功能
 */
export function useTable<T = unknown, Q extends object = object>(options: TableOptions<T, Q>) {
  const { fetchApi, defaultQuery = {}, defaultPageSize = 10, immediate = true } = options

  // 表格数据
  const tableData = ref<T[]>([]) as { value: T[] }

  // 加载状态
  const loading = ref(false)

  // 分页信息
  const pagination = reactive({
    page: 1,
    pageSize: defaultPageSize,
    total: 0,
  })

  // 查询参数
  const queryParams = reactive<Q>({ ...defaultQuery } as Q)

  // 总页数
  const totalPages = computed(() => Math.ceil(pagination.total / pagination.pageSize))

  /**
   * 获取表格数据
   */
  async function fetchData() {
    loading.value = true
    try {
      const params = {
        ...queryParams,
        page: pagination.page,
        pageSize: pagination.pageSize,
      } as Q
      const result = await fetchApi(params)
      tableData.value = result.list
      pagination.total = result.total
    }
    catch (error) {
      console.error("获取表格数据失败:", error)
      tableData.value = []
      pagination.total = 0
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 刷新表格（保持当前页）
   */
  function refresh() {
    fetchData()
  }

  /**
   * 重置并刷新（回到第一页）
   */
  function reset() {
    pagination.page = 1
    Object.assign(queryParams, defaultQuery)
    fetchData()
  }

  /**
   * 搜索（回到第一页）
   */
  function search() {
    pagination.page = 1
    fetchData()
  }

  /**
   * 切换页码
   */
  function handlePageChange(page: number) {
    pagination.page = page
    fetchData()
  }

  /**
   * 切换每页条数
   */
  function handleSizeChange(size: number) {
    pagination.pageSize = size
    pagination.page = 1
    fetchData()
  }

  // 立即加载
  if (immediate) {
    fetchData()
  }

  return {
    tableData,
    loading,
    pagination,
    queryParams,
    totalPages,
    fetchData,
    refresh,
    reset,
    search,
    handlePageChange,
    handleSizeChange,
  }
}
