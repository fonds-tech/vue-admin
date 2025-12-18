// UnoCSS
import "virtual:uno.css"
// SVG Icons
import "virtual:svg-icons-register"

import ElementPlus from "element-plus"
import { createApp } from "vue"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"

import App from "./App.vue"
import pinia from "./stores"
import { setupRouter } from "@/router"
import { useSettingsStore } from "@/stores"
import i18n, { elementPlusLocales } from "./locales"

import "./styles/index.scss"
import "@fonds/vue-crud/index.css"

const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 安装插件
// app.use(Crud)
app.use(pinia)
app.use(i18n)

// 获取当前语言并配置 Element Plus
const settingsStore = useSettingsStore()
const locale = elementPlusLocales[settingsStore.language as keyof typeof elementPlusLocales]
app.use(ElementPlus, { locale })

setupRouter(app)

app.mount("#app")
