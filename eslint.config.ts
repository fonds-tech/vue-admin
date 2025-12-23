import eslint from "@fonds/eslint-config"

export default eslint(
  {
    vue: true,
    jsx: true,
    markdown: false,
    formatters: true,
    typescript: {
      tsconfigPath: "./tsconfig.eslint.json",
    },
  },
  {
    rules: {
      "style/brace-style": "off",
      "style/arrow-parens": "off",
      "style/member-delimiter-style": "off",
    },
  },
  {
    ignores: ["dist", "openspec", "node_modules", "*.d.ts", "eslint.config.ts"],
  },
)
