import type { GuardStep } from "../types"

export const registered: GuardStep = ({ router, to }) => {
  const match = router.getRoutes().find((route) => route.path === to.path || route.name === to.name)
  if (match?.components?.default) {
    return { type: "next" }
  }
}
