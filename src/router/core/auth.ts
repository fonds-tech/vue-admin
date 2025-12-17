import type { GuardStep } from "../types"
import { isEmpty } from "@fonds/utils"

export const auth: GuardStep = ({ app }) => {
  if (isEmpty(app.token)) {
    return { type: "redirect", to: "/login" }
  }
}
