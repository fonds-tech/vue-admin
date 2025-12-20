# Change: 添加页面切换过渡效果（方案 A）

## Why
当前页面切换缺少统一过渡动画，用户在导航时缺少视觉连续性与状态反馈。

## What Changes
- 在主布局的页面容器中加入页面切换过渡效果。
- 复用系统设置中的过渡动画选项（淡入淡出/滑动/缩放/无动画）。
- 过渡动画样式集中写入 `src/styles/transition.scss` 并在样式入口引入。
- 保持现有 keep-alive 与路由缓存策略不变。

## Impact
- Affected specs: 新增 capability `page-transition`（当前无现有 specs）。
- Affected code: `src/layout/components/fd-view/index.vue`、`src/styles/transition.scss`、`src/styles/index.scss`。
