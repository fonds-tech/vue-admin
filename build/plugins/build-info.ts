import type { Plugin } from "vite"
import { getPackageSize } from "../utils"
import dayjs, { type Dayjs } from "dayjs"
import duration from "dayjs/plugin/duration"
import gradientString from "gradient-string"
import boxen, { type Options as BoxenOptions } from "boxen"

dayjs.extend(duration)

const boxenOptions: BoxenOptions = {
  padding: 0.5,
  borderColor: "cyan",
  borderStyle: "round",
}

/**
 * 构建信息插件
 * - 显示打包用时和打包后大小
 * - 在 HTML 中注入构建日期
 */
export function createBuildInfo(): Plugin[] {
  let config: { command: string }
  let startTime: Dayjs
  let endTime: Dayjs
  let outDir: string

  return [
    {
      name: "vite:buildInfo",
      configResolved(resolvedConfig) {
        config = resolvedConfig
        outDir = resolvedConfig.build?.outDir ?? "dist"
      },
      buildStart() {
        if (config.command === "build") {
          startTime = dayjs(new Date())
        }
      },
      closeBundle() {
        if (config.command === "build") {
          endTime = dayjs(new Date())
          getPackageSize({
            folder: outDir,
            callback: (size: string) => {
              console.log(
                boxen(
                  gradientString("cyan", "magenta").multiline(`🎉 打包完成（总用时${dayjs.duration(endTime.diff(startTime)).format("mm分ss秒")}，打包后的大小为${size}）`),
                  boxenOptions,
                ),
              )
            },
          })
        }
      },
    },
    {
      name: "vite:html-transform",
      transformIndexHtml(html) {
        return html.replace("%BUILD_DATE%", dayjs().format("YYYY-MM-DD HH:mm:ss"))
      },
    },
  ]
}
