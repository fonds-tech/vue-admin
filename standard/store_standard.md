# Store 开发规范

本文档定义了 Pinia Store 的开发规范，旨在统一代码风格，提升代码的可读性、可维护性和工程质量。

## 1. 结构与布局

### 1.1 总体结构

Store 的定义应保持紧凑清爽，减少不必要的分割线。推荐的顺序为：

1. **Imports**: 类型导入与外部依赖。
2. **defineStore**: 核心定义。
   - **state**: 定义响应式数据。
   - **getters**: 定义衍生状态。
   - **actions**: 定义方法逻辑。
   - **persist**: 持久化配置（可选）。

### 1.2 注释规范

- **禁止使用冗余分割线**：禁止使用类似 `// ========== XXX ==========` 的注释放式。
- **强制使用 JSDoc**：
  - 每个 Getter 必须包含 JSDoc 注释。
  - 每个 Action 必须包含 JSDoc 注释，详细说明描述（@description）、参数（@param）和返回值（@returns）。
  - 简单的 Setter 可以仅保留单行 JSDoc。

## 2. 命名规范

### 2.1 语义化

方法名应真实反映其行为，体现“工程化”风格：

- **初始化类**：统一使用 `initialize` 作为顶层入口。内部细分初始化使用 `initXXX`。
- **执行类**：涉及具体 DOM 操作或复杂逻辑执行的方法，推荐使用 `executeXXX` 前缀。
- **获取类**：辅助性质的解析函数推荐使用 `getXXX` 而非 `parseXXX`。
- **切换类**：状态翻转使用 `toggleXXX`。

### 2.2 示例对照

| 推荐写法              | 不推荐写法       |
| :-------------------- | :--------------- |
| `initialize`          | `init` / `start` |
| `initStaticDetection` | `detectDevice`   |
| `executeThemeApply`   | `applyTheme`     |
| `getSystemOS`         | `parseOS`        |
| `getTouchSupport`     | `hasTouch`       |

## 3. 初始化逻辑

### 3.1 统一入口

每个需要初始化的 Store 应提供一个 `initialize` 方法。该方法应位于 `actions` 的顶部，并负责调用相关的私有初始化逻辑。

### 3.2 调用顺序

`init` 相关的方法应紧随其调用者 `initialize` 之后，并按照执行顺序排列，以便于开发者追踪逻辑。

```typescript
actions: {
  /** 统一初始化入口 */
  initialize() {
    this.initA()
    this.initB()
  },

  /** 初始化 A */
  initA() { ... },

  /** 初始化 B */
  initB() { ... },
}
```

## 4. Getter 规范

- **显式类型标注**：Getter 的返回值应显式标注类型（如 `: boolean`），以增强 IDE 的类型推导能力。
- **代码整洁**：每个 Getter 之间保留一个空行。

## 5. 持久化 (Persistence)

- **按需持久化**：使用 `pick` 或 `omit` 明确指定需要持久化的字段，避免污染持久化存储。
