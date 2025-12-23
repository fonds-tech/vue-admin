import eslint from "@fonds/eslint-config"

export default eslint(
  {
    vue: true,
    jsx: true,
    markdown: false,
    formatters: true,
    typescript: { tsconfigPath: "./tsconfig.eslint.json" },
  },
  {
    rules: {
      /* ==================== style - 代码风格 ==================== */
      // 关闭箭头函数参数必须加括号的检查
      "style/arrow-parens": "off",
      // 关闭大括号风格的检查
      "style/brace-style": "off",
      // 关闭接口/类型成员分隔符风格的检查
      "style/member-delimiter-style": "off",

      /* ==================== ts - TypeScript ==================== */
      // 关闭未处理的 Promise 检查
      "ts/no-floating-promises": "off",
      // 关闭 any 类型值作为函数参数的检查
      "ts/no-unsafe-argument": "off",
      // 关闭 any 类型值赋值的检查
      "ts/no-unsafe-assignment": "off",
      // 关闭调用 any 类型值的检查
      "ts/no-unsafe-call": "off",
      // 关闭访问 any 类型值属性的检查
      "ts/no-unsafe-member-access": "off",
      // 关闭函数返回 any 类型值的检查
      "ts/no-unsafe-return": "off",
      // 关闭返回 Promise 的函数必须标记 async 的检查
      "ts/promise-function-async": "off",
      // 关闭条件判断必须使用严格布尔表达式的检查
      "ts/strict-boolean-expressions": "off",
    },
  },
  {
    ignores: ["dist", "openspec", "node_modules", "*.d.ts", "eslint.config.ts"],
  },
)
