import process from "node:process"
import { resolve } from "node:path"
import { createVitePlugins } from "./build/plugins"
import { loadEnv, defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isDev = mode === "development"

  return {
    plugins: createVitePlugins({ isDev }),
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${resolve(__dirname, "src/styles/variables.scss").replace(/\\/g, "/")}" as *;`,
        },
      },
    },
    server: {
      port: 5300,
      host: true,
      open: true,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:3000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      target: "es2015",
      outDir: "dist",
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            elementPlus: ["element-plus", "@element-plus/icons-vue"],
          },
        },
      },
    },
  }
})
