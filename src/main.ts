import ElementPlus from "element-plus"
import { createApp } from "vue"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import "element-plus/dist/index.css"

import App from "./App.vue"
import pinia from "./stores"
import router from "./router"
import { useAppStore } from "./stores/app"
import i18n, { elementPlusLocales } from "./locales"

import "./styles/index.scss"

const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 安装插件
app.use(pinia)
app.use(router)
app.use(i18n)

// 获取当前语言并配置 Element Plus
const appStore = useAppStore()
const locale = elementPlusLocales[appStore.language as keyof typeof elementPlusLocales]
app.use(ElementPlus, { locale })

app.mount("#app")
