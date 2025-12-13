# Vue 组件开发规范

> 本规范适用于 Vue 3 + TypeScript 项目，涵盖 `.vue` 单文件组件和 `.tsx` JSX 组件两种形式。

---

## 目录结构

组件应遵循统一的目录结构，便于维护和扩展：

```
src/components/
├── core/                    # 核心基础组件
│   └── fd-icon/
│       ├── types.ts         # 类型定义
│       ├── fd-icon.vue      # 组件实现
│       └── index.ts         # 统一导出
├── business/                # 业务组件
└── common/                  # 通用组件
```

### 文件命名规则

| 文件类型 | 命名规范 | 示例 |
|---------|---------|------|
| 组件目录 | kebab-case（带 fd- 前缀） | `fd-icon/`、`fd-button/` |
| Vue 组件 | kebab-case.vue（带 fd- 前缀） | `fd-icon.vue`、`fd-button.vue` |
| TSX 组件 | kebab-case.tsx 或 index.tsx | `fd-menu.tsx`、`index.tsx` |
| 类型文件 | types.ts | `types.ts` |
| 样式文件 | index.scss | `index.scss` |
| 入口文件 | index.ts | `index.ts` |

> **注意**：`fd-` 前缀仅用于**文件/目录名**、**组件 name 属性**和 **CSS class 名**，类型接口名称不加前缀。

---

## 类型定义规范（types.ts）

所有组件的类型定义应抽离到独立的 `types.ts` 文件中：

```typescript
/**
 * Button 组件类型定义
 */

import type { Component } from "vue"

// ==================== 基础类型 ====================

/** 使用 type 定义联合类型 */
export type ButtonSize = "small" | "medium" | "large"
export type ButtonType = "primary" | "success" | "warning" | "danger"

// ==================== Props 接口 ====================

/** 使用 interface 定义对象结构（不加 fd 前缀） */
export interface ButtonProps {
  /** 按钮类型 */
  type?: ButtonType
  /** 按钮尺寸 */
  size?: ButtonSize
  /** 是否禁用 */
  disabled?: boolean
  /** 是否加载中 */
  loading?: boolean
  /** 图标 */
  icon?: string | Component
}

// ==================== Emits 类型 ====================

/** 组件事件类型（不加 fd 前缀） */
export interface ButtonEmits {
  (e: "click", event: MouseEvent): void
  (e: "focus", event: FocusEvent): void
}

// ==================== Slots 类型 ====================

/** 插槽类型（不加 fd 前缀） */
export interface ButtonSlots {
  default?: () => VNode
  icon?: () => VNode
}
```

### 类型命名规范

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| Props | `{ComponentName}Props` | `IconProps`、`ButtonProps` |
| Emits | `{ComponentName}Emits` | `ButtonEmits`、`MenuEmits` |
| Slots | `{ComponentName}Slots` | `CardSlots`、`DialogSlots` |
| 联合类型 | 语义化名称 | `ButtonSize`、`MenuLayout` |

> **重点**：类型接口名称使用组件语义名称，不加 `Fd` 前缀。

---

## Vue 单文件组件规范（.vue）

### 基本结构

```vue
<template>
  <!-- class 使用 fd- 前缀 -->
  <div class="fd-button" :class="buttonClasses" @click="handleClick">
    <slot name="icon">
      <Icon v-if="icon" :icon="icon" />
    </slot>
    <span class="fd-button__text">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue"
import type { ButtonProps, ButtonEmits } from "./types"  // 类型不加 fd 前缀
import { Icon } from "@/components/core/fd-icon"
import { computed } from "vue"

// ==================== 组件选项 ====================

defineOptions({
  name: "fd-button",  // name 属性使用 fd- 前缀
})

// ==================== Props ====================

const props = withDefaults(defineProps<ButtonProps>(), {
  type: "primary",
  size: "medium",
  disabled: false,
  loading: false,
})

// ==================== Emits ====================

const emit = defineEmits<ButtonEmits>()

// ==================== 计算属性 ====================

/** 按钮样式类 */
const buttonClasses = computed(() => ({
  [`fd-button--${props.type}`]: props.type,  // class 使用 fd- 前缀
  [`fd-button--${props.size}`]: props.size,
  "is-disabled": props.disabled,
  "is-loading": props.loading,
}))

// ==================== 方法 ====================

/** 点击处理 */
function handleClick(event: MouseEvent): void {
  if (props.disabled || props.loading) return
  emit("click", event)
}
</script>

<style lang="scss" scoped>
/* class 使用 fd- 前缀 */
.fd-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &__text {
    margin-left: 4px;
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>
```

### Script 区块顺序

按以下顺序组织代码，使用注释分隔各区块：

```typescript
// 1. 类型导入（type imports）
import type { CSSProperties } from "vue"
import type { ButtonProps } from "./types"

// 2. 模块导入（module imports）
import { Icon } from "@/components/core/fd-icon"
import { computed, ref, watch } from "vue"

// 3. defineOptions
defineOptions({ name: "fd-button" })

// 4. defineProps
const props = withDefaults(defineProps<ButtonProps>(), { ... })

// 5. defineEmits
const emit = defineEmits<ButtonEmits>()

// 6. 响应式状态（ref/reactive）
const isExpanded = ref(false)

// 7. 计算属性（computed）
const buttonClasses = computed(() => ...)

// 8. 侦听器（watch/watchEffect）
watch(() => props.value, (newVal) => ...)

// 9. 生命周期钩子
onMounted(() => ...)

// 10. 方法定义
function handleClick(): void { ... }

// 11. 暴露给父组件的方法（defineExpose）
defineExpose({ focus, blur })
```

### 导入顺序规则

```typescript
// 1. 外部类型导入
import type { CSSProperties, PropType } from "vue"

// 2. 内部类型导入（相对路径）
import type { ButtonProps } from "./types"

// 3. 外部模块导入
import { ElButton } from "element-plus"
import { computed, ref } from "vue"

// 4. 内部模块导入（别名路径）
import { Icon } from "@/components/core/fd-icon"
import { useAppStore } from "@/stores/app"

// 5. 相对路径导入
import "./index.scss"
```

---

## TSX 组件规范（.tsx）

### 基本结构

```tsx
import type { BackendMenu } from "./types"
import type { CSSProperties, PropType } from "vue"
import { Icon } from "@/components/core/fd-icon"
import { useAppStore } from "@/stores/app"
import { computed, defineComponent, ref } from "vue"
import "./index.scss"

// ==================== 组件定义 ====================

export default defineComponent({
  name: "fd-menu",  // name 属性使用 fd- 前缀

  props: {
    /** 菜单数据 */
    menus: {
      type: Array as PropType<BackendMenu[]>,
      required: true,
    },
    /** 是否折叠 */
    collapsed: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    /** 菜单选中事件 */
    select: (path: string) => typeof path === "string",
  },

  setup(props, { emit, slots }) {
    const appStore = useAppStore()

    // ==================== 响应式状态 ====================

    const activeIndex = ref<string>("")

    // ==================== 计算属性 ====================

    /** 菜单样式 */
    const menuStyle = computed<CSSProperties>(() => ({
      width: props.collapsed ? "64px" : "220px",
    }))

    // ==================== 方法 ====================

    /**
     * 处理菜单选择
     * @param path - 菜单路径
     */
    function handleSelect(path: string): void {
      activeIndex.value = path
      emit("select", path)
    }

    // ==================== 渲染函数 ====================

    /**
     * 渲染菜单图标
     * @param icon - 图标名称
     */
    function renderIcon(icon?: string) {
      if (!icon) return null
      return <Icon icon={icon} size={18} />
    }

    /**
     * 渲染菜单项
     * @param menu - 菜单数据
     */
    function renderMenuItem(menu: BackendMenu) {
      return (
        // class 使用 fd- 前缀
        <div class="fd-menu__item" onClick={() => handleSelect(menu.path)}>
          {renderIcon(menu.meta?.icon)}
          <span class="fd-menu__title">{menu.meta?.title}</span>
        </div>
      )
    }

    // ==================== 组件渲染 ====================

    return () => (
      <div class="fd-menu" style={menuStyle.value}>
        {props.menus.map((menu) => renderMenuItem(menu))}
        {slots.default?.()}
      </div>
    )
  },
})
```

### TSX 与 Vue SFC 选择指南

| 场景 | 推荐格式 | 原因 |
|------|---------|------|
| 简单 UI 组件 | `.vue` | 模板语法更直观，样式隔离方便 |
| 复杂逻辑组件 | `.tsx` | 更好的 TypeScript 支持，逻辑复用 |
| 递归渲染 | `.tsx` | 渲染函数更灵活 |
| 动态组件 | `.tsx` | 更容易处理动态渲染逻辑 |
| 菜单/树形组件 | `.tsx` | 递归渲染更便捷 |
| 表单组件 | `.vue` | v-model 语法更简洁 |

---

## 入口文件规范（index.ts）

每个组件目录必须有 `index.ts` 作为统一导出入口：

```typescript
/**
 * Icon 组件导出
 */

import Icon from "./fd-icon.vue"

// 导出组件（变量名不加 fd 前缀）
export { Icon }

// 导出类型
export * from "./types"

// 默认导出
export default Icon
```

### 使用方式

```typescript
// 命名导入（推荐，不带 fd 前缀）
import { Icon } from "@/components/core/fd-icon"
import { Button } from "@/components/core/fd-button"

// 导入类型（不带 fd 前缀）
import type { IconProps, ButtonProps } from "@/components/core/fd-icon"

// 默认导入
import Icon from "@/components/core/fd-icon"
```

---

## 样式规范

### BEM 命名规范

使用 BEM（Block-Element-Modifier）命名规范，Block 使用 `fd-` 前缀：

```scss
// Block: 组件根元素（使用 fd- 前缀）
.fd-button {
  display: inline-flex;

  // Element: 组件内部元素，使用 __
  &__icon {
    margin-right: 4px;
  }

  &__text {
    font-size: 14px;
  }

  // Modifier: 状态变体，使用 --
  &--primary {
    background-color: var(--el-color-primary);
  }

  &--small {
    padding: 4px 8px;
  }

  // State: 状态类，使用 is- 前缀
  &.is-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.is-loading {
    pointer-events: none;
  }
}
```

### 样式变量使用

优先使用 CSS 变量和设计系统变量：

```scss
.fd-card {
  // 使用 Element Plus 变量
  color: var(--el-text-color-primary);
  background: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);

  // 使用项目自定义变量
  padding: var(--fd-spacing-md);
}
```

---

## 命名规范总结

### fd- 前缀使用范围

| 场景 | 是否使用 fd- 前缀 | 示例 |
|------|------------------|------|
| 文件/目录名 | ✅ 是 | `fd-icon/`、`fd-button.vue` |
| 组件 name 属性 | ✅ 是 | `name: "fd-icon"` |
| CSS class 名 | ✅ 是 | `.fd-button`、`.fd-menu__item` |
| 类型接口名 | ❌ 否 | `IconProps`、`ButtonEmits` |
| 导出变量名 | ❌ 否 | `export { Icon }` |
| 导入变量名 | ❌ 否 | `import { Icon }` |

### defineOptions 规范

```typescript
// Vue SFC
defineOptions({
  name: "fd-button",  // 使用 fd- 前缀 + kebab-case
})

// TSX
export default defineComponent({
  name: "fd-menu",    // 使用 fd- 前缀 + kebab-case
  // ...
})
```

---

## 注释规范

### JSDoc 注释

```typescript
/**
 * 判断是否为外链
 * @param path - 路径字符串
 * @returns 是否为 http/https 开头的外链
 */
function isExternalLink(path: string): boolean {
  return /^https?:\/\//.test(path)
}

/** 计算完整路径 */
const fullPath = computed<string>(() => { ... })
```

### 区块注释

使用统一格式的区块注释分隔代码：

```typescript
// ==================== Props ====================

// ==================== 计算属性 ====================

// ==================== 方法 ====================

// ==================== 渲染函数 ====================
```

---

## 完整示例

### Vue SFC 组件

```
src/components/core/fd-button/
├── types.ts         # IconProps, ButtonEmits（不加 fd 前缀）
├── fd-button.vue    # name: "fd-button"
└── index.ts         # export { Button }（不加 fd 前缀）
```

### TSX 组件

```
src/layout/components/fd-menu/
├── types.ts         # MenuProps, BackendMenu（不加 fd 前缀）
├── index.tsx        # name: "fd-menu"
└── index.scss       # .fd-menu { }（使用 fd 前缀）
```
