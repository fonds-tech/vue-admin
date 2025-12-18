# 项目概述

- Vue Admin：基于 Vue 3 + TypeScript + Vite 的后台管理模板，内置 Element Plus、动态路由、权限控制、Pinia 持久化、多语言与常用工程化配置。

## 技术栈与依赖

- 前端：Vue 3、TypeScript、Vite、Pinia、Vue Router、vue-i18n、Element Plus。
- 工具链：pnpm、Vitest、Stylelint、unplugin-auto-import、unplugin-vue-components。
- 请求层：alova + axios；样式：SCSS 与全局变量注入。

## 主要功能域

- 登录/登出与路由鉴权，角色/权限点校验，动态路由懒注册。
- 主题与布局（亮/暗色、主题色、侧边栏折叠、标签栏缓存与刷新）。
- 多语言（zh-CN/en-US）与 Element Plus locale 联动；全局水印。
- 示例页面：仪表盘、系统管理、监控、组件示例、嵌套菜单、个人中心、关于等。
- 工程化能力：自动导入、Stylelint 校验、构建信息输出、Vitest 单测。

## 运行与环境

- Node.js ≥ 18，包管理使用 pnpm。
- 常用命令：`pnpm install`、`pnpm dev`、`pnpm build`、`pnpm preview`、`pnpm lint`、`pnpm test`。
- 开发默认端口 5300，代理 `/api` 到 `VITE_API_BASE_URL`。

## 质量基线与约定

- 语言与文档全部使用中文；英文专业名词需附中文解释。
- 代码需中文注释说明关键逻辑；遵循 SOLID、DRY、KISS 与关注点分离。
- 测试优先：Vitest 单测可作为质量门；类型检查与 Stylelint 需通过。

## OpenSpec 使用提示

- `openspec/specs/`：当前源规范（source-of-truth），后续提案通过后归档至此。
- `openspec/changes/`：进行中的或历史变更，建议以递增 ID 目录存放 proposal/tasks/spec。
- `openspec/changes/archive/`：已归档变更存放处。
- 建议先在 changes 目录提交提案，经评审后合并到 specs。
