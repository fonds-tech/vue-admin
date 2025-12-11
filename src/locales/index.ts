/**
 * Vue I18n 国际化配置
 */
import enUS from "./en-US"
import zhCN from "./zh-CN"
import enLocale from "element-plus/es/locale/lang/en"

// Element Plus 语言包
import zhCnLocale from "element-plus/es/locale/lang/zh-cn"
import { createI18n } from "vue-i18n"

/**
 * 语言包配置
 */
const messages = {
  "zh-CN": zhCN,
  "en-US": enUS,
}

/**
 * Element Plus 语言包映射
 */
export const elementPlusLocales = {
  "zh-CN": zhCnLocale,
  "en-US": enLocale,
}

/**
 * 获取当前语言
 */
function getLanguage(): string {
  const cachedLang = localStorage.getItem("language")
  if (cachedLang) return cachedLang

  // 根据浏览器语言设置默认语言
  const browserLang = navigator.language
  if (browserLang.startsWith("zh")) return "zh-CN"
  return "en-US"
}

/**
 * 创建 i18n 实例
 */
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getLanguage(),
  fallbackLocale: "zh-CN",
  messages,
  globalInjection: true, // 全局注入 $t 函数
})

export default i18n
