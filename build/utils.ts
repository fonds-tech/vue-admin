import fs from "fs"
import path from "path"

interface PackageSizeOptions {
  folder: string
  callback: (size: string) => void
}

/**
 * 格式化文件大小
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

/**
 * 递归获取文件夹大小
 */
function getFolderSize(folderPath: string): number {
  let totalSize = 0

  if (!fs.existsSync(folderPath)) {
    return totalSize
  }

  const files = fs.readdirSync(folderPath)

  for (const file of files) {
    const filePath = path.join(folderPath, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      totalSize += getFolderSize(filePath)
    } else {
      totalSize += stats.size
    }
  }

  return totalSize
}

/**
 * 获取打包后的文件夹大小
 */
export function getPackageSize({ folder, callback }: PackageSizeOptions): void {
  const size = getFolderSize(folder)
  callback(formatBytes(size))
}
