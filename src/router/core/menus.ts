import type { GuardStep } from "../types"

export const menus: GuardStep = async ({ menu }) => {
  if (!menu.initialized) {
    await menu.fetchMenus()
  }
}
