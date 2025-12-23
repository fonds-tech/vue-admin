import type { Router } from "vue-router"
import { useMenuStore, useUserStore } from "@/stores"

export function setupBeforeEachGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const userStore = useUserStore()
    const menuStore = useMenuStore()
    const appRouter = router as Router & {
      add: (data: any | any[]) => void
      find: (path: string) => { isReg: boolean; route?: any }
    }

    const ignorePaths = ["/login", "/403", "/404", "/500"]
    const shouldIgnore = ignorePaths.includes(to.path) || to.meta?.ignore || to.meta?.public

    if (shouldIgnore) {
      next()
      return
    }

    if (!userStore.isLoggedIn) {
      next("/login")
      return
    }

    if (!menuStore.initialized) {
      await menuStore.init()
    }

    const { isReg, route } = appRouter.find(to.path)
    if (!route) {
      next("/404")
      return
    }

    if (!isReg) {
      appRouter.add(route)
      next(to.fullPath)
      return
    }

    next()
  })
}
