# Vue Admin

基于 Vue 3 + TypeScript + Vite 的后台管理模板，内置 Element Plus、动态路由、权限控制、Pinia 持久化、多语言和常用工程化配置。

## 功能特性

- 登录/登出与路由鉴权（白名单、未登录跳转、401 自动退出）
- 动态路由懒注册：按后端菜单在运行时注册 Layout 子路由
- 角色/权限点校验：`roles` + `permissions`，提供 `usePermission` Hook
- 进程标签栏（多标签页）+ keep-alive 缓存 + 页面刷新
- 主题与布局：亮/暗色模式、主题色切换、侧边栏折叠、固定顶栏、标签栏显隐、菜单模式
- 水印：全局水印层，文字为当前用户昵称，可通过 `appStore.showWatermark` 控制
- 多语言：`zh-CN` / `en-US`，切换后刷新并同步 Element Plus locale
- 示例页面：仪表盘、系统管理（用户/角色/菜单/部门/字典）、系统监控、组件示例、嵌套菜单、个人中心、关于等
- Iframe/外链支持：菜单 `meta.frameSrc` / `meta.link`
- 工程化：自动导入 API/组件、ESLint/Stylelint/Prettier、Vitest 单测、构建信息输出

## 技术栈

- Vue 3 + TypeScript + Vite
- UI：Element Plus（含图标）
- 状态：Pinia（支持持久化）
- 路由：Vue Router 动态注册与守卫
- 多语言：vue-i18n，Element Plus 语言包联动
- 请求：alova + axios
- 样式与规范：SCSS、ESLint、Stylelint、Prettier
- 测试：Vitest + @vue/test-utils + jsdom

## 环境要求

- Node.js ≥ 18（推荐使用 pnpm 8+）
- 包管理：pnpm

## 快速开始

```bash
pnpm install
pnpm dev          # 本地开发
pnpm build        # 构建产物
pnpm preview      # 预览构建结果
```

## 开发与质量脚本

- `pnpm lint` / `pnpm lint:style`：ESLint、Stylelint 检查（含自动修复）
- `pnpm format`：Prettier 格式化
- `pnpm type-check`：类型检查
- `pnpm test` / `pnpm test:coverage`：单测与覆盖率

## 目录速览

- `src/main.ts`：应用入口，注册 Element Plus、Pinia、Router、i18n，并按存储语言配置 Element Plus locale
- `src/router`：静态路由、动态路由注册与守卫
- `src/stores`：Pinia 状态（含用户、菜单、权限、应用设置、进程标签等）
- `src/layout`：布局、侧边栏、顶栏、设置抽屉、水印、视图出口等
- `src/locales`：多语言资源
- `src/http` / `src/api`：请求封装与接口定义
- `src/styles`：全局样式与主题变量
- `public/`：静态资源

## 默认账号（Mock）

当前内置模拟登录与菜单数据（`src/stores/user`、`src/stores/mock/menu.ts`）：

- 管理员：`admin / 123456`（完整菜单与权限）
- 普通用户：`user / 123456`（受限菜单）

如接入真实后端，请按下文替换 Mock。

## 后端接入指南

### 1. 登录与用户信息

- 登录接口：`POST /auth/login`，参数见 `src/api/auth/interface.ts`
- 用户信息：`GET /auth/userinfo`
- 登出/刷新 Token：`POST /auth/logout`、`POST /auth/refresh`
- Token 存储在 `user-store`，请求会在 `src/http/alova.ts` 中自动加 `Authorization: Bearer <token>`。
- 业务响应约定：
  - 统一结构 `{ code, message, data }`（`src/http/interface.ts`）
  - `code === 0` 视为成功，非 0 会弹出错误提示
  - `401` 会触发自动登出并跳转登录页

需要把 `src/stores/user/index.ts` 中的 Mock 登录/获取用户信息替换为真实 API 调用。

### 2. 菜单与动态路由

菜单数据结构（后端返回）参见 `BackendMenu`（`src/stores/permission/interface.ts`），关键字段：

- `path` / `name` / `component`：路由路径、名称、视图组件（对应 `src/views/<component>.vue`）
- `meta.title` / `meta.icon`：侧边栏标题与图标
- `meta.hidden`：是否在侧边栏隐藏
- `meta.keepAlive`：是否加入缓存标签（与 keep-alive 联动）
- `meta.roles` / `meta.permissions`：访问控制
- `meta.frameSrc`：iframe 地址
- `meta.link`：外链（不注册组件）

路由守卫 `src/router/guard.ts` 会在首次进入时拉取菜单，并按需 `router.add` 动态注册。

需要把 `src/stores/menu/index.ts` 的 `getMenusByUsername` Mock 替换为真实菜单接口。

## 环境变量

参考 `.env.development` / `.env.production`：

- `VITE_APP_TITLE`：应用标题
- `VITE_API_BASE_URL`：接口基础地址（开发默认 `/api`，生产示例 `https://api.example.com`）
- `VITE_APP_ENV`：环境标识

## 开发配置

- 本地服务：默认端口 `5300`，会自动打开浏览器。
- 代理：开发环境 `/api` 会代理到 `VITE_API_BASE_URL`（未配置则 `http://localhost:3000`），并自动去掉 `/api` 前缀。
- 路径别名：`@` 指向 `src/`（`vite.config.ts`）。
- SCSS：自动注入 `src/styles/variables.scss`，在任意 `.scss`/`<style lang="scss">` 中可直接使用变量。

## 自动导入与组件注册

- `unplugin-auto-import` 自动导入 Vue/Router/Pinia/VueUse/i18n API 与 Element Plus 组件（`build/plugins/auto-import.ts`）。
- `unplugin-vue-components` 自动注册 Element Plus 和 `src/components` 下组件（`build/plugins/components.ts`）。

## 构建说明

- 产物输出到 `dist/`，并按 `vue` / `elementPlus` 进行分包（`vite.config.ts`）。
- 构建完成会打印耗时与包体积，并在 `index.html` 注入构建时间 `%BUILD_DATE%`（`build/plugins/build-info.ts`）。

## 许可证

MIT
