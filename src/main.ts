import App from "./App.vue"
import i18n from "./locales"
import { Crud } from "@fonds/vue-crud"
import { createApp } from "vue"
import { setupRouter } from "@/router"
import { setupStores } from "@/stores"

import "virtual:uno.css"
import "virtual:svg-icons-register"
import "./styles/index.scss"
import "@fonds/vue-crud/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"

const app = createApp(App)

setupStores(app)
setupRouter(app)

app.use(i18n)
app.use(Crud)

app.mount("#app")
