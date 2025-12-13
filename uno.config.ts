import { presetIcons, presetWind4, defineConfig, transformerDirectives, transformerVariantGroup } from "unocss"

export default defineConfig({
  presets: [presetWind4(), presetIcons({ scale: 1.2, warn: true })],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  shortcuts: [],
  safelist: [],
  theme: {
    colors: {
      primary: "var(--el-color-primary)",
    },
  },
})
