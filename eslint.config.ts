import eslint from "@fonds/eslint-config";

export default eslint(
  {
    vue: true,
    jsx: true,
    typescript: true,
    formatters: true,
  },
  {
    ignores: ["dist", "node_modules", "*.d.ts"],
  }
);
