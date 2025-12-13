import eslint from "@fonds/eslint-config"

export default eslint(
  {
    type: "app",
    vue: true,
    jsx: true,
    typescript: true,
    formatters: true,
  },
  {
    rules: {
      "style/arrow-parens": "off",
      "ts/no-use-before-define": "off",
      "no-async-promise-executor": "off",
    },
  },
  {
    ignores: ["standard"],
  },
)
