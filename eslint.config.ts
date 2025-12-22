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
      "style/member-delimiter-style": "off",
    },
  },
  {
    ignores: ["dist", "openspec", "node_modules", "*.d.ts"],
  },
)
