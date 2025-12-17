import type { GuardStep } from "../types"

export const whitelist: GuardStep = ({ to }) => {
  if (to.meta?.public || to.meta?.ignore) {
    return { type: "next" }
  }
}
