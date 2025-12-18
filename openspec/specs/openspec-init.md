# OpenSpec 初始化（变更 0001）

- 目录结构
  - `openspec/project.md`：项目概述、技术栈、功能域、质量基线、OpenSpec 使用提示。
  - `openspec/config.json`：语言/文档格式、工具链、变更路径约定。
  - `openspec/AGENTS.md`：AGENT 行为摘要与工具触发规则。
  - `openspec/specs/README.md`：源规范存放与合规说明。
  - `openspec/changes/0001-openspec-init/`：首个变更的 proposal/tasks/spec。
  - `openspec/changes/archive/`：预留归档目录。
- 适用流程
  - 新需求或架构变更：在 `changes/` 下创建新 ID 目录，先写 `proposal.md`，经评审后补全 `tasks.md` 与 `spec.md`。
  - 共识后将规范内容同步/合并到 `specs/`，原变更目录移入 archive。
- 边界
  - 本规范仅覆盖 OpenSpec 流程与文档结构，不改动业务代码；后续迭代需在新变更中说明。
