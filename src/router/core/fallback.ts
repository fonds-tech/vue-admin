import type { GuardStep } from "../types"

export const fallback: GuardStep = () => ({ type: "redirect", to: "/404" })
