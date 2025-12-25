import type { Router } from "vue-router"
import { useProcessStore } from "@/stores"

export function setupAfterEachGuard(router: Router) {
  router.afterEach((to) => {
    // 忽略不需要进程标签的路由
    if (to.meta?.ignore || to.meta?.process === false || to.meta?.fullScreen) return

    const processStore = useProcessStore()
    const metaTitle = to.meta?.title
    const name = to.name
    const title = typeof metaTitle === "string" ? metaTitle : typeof name === "string" ? name : to.path

    processStore.add({
      path: to.path,
      fullPath: to.fullPath,
      name: typeof name === "string" ? name : to.path,
      title,
      affix: !!to.meta?.affix,
    })
  })
}
