import eslint from "@fonds/eslint-config"

export default eslint(
  {
    vue: true,
    jsx: true,
    markdown: false,
    typescript: true,
    formatters: true,
  },
  {
    rules: {
      "style/brace-style": "off",
      "style/arrow-parens": "off",
    },
  },
  {
    ignores: ["dist", "node_modules", "*.d.ts"],
  },
)
