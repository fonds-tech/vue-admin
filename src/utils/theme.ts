/**
 * 主题切换工具模块
 * 使用 View Transitions API 实现圆形扩散动画效果
 */

// ==================== 类型定义 ====================

/** 主题类型 */
export type ThemeMode = "light" | "dark"

/** 主题切换配置选项 */
export interface ThemeToggleOptions {
  /** 是否启用动画，默认 true */
  enableAnimation?: boolean
  /** 动画持续时间（毫秒），默认 400 */
  duration?: number
  /** 动画缓动函数，默认 ease-out */
  easing?: string
  /** 扩散起点 x 坐标（不传则使用屏幕中心） */
  x?: number
  /** 扩散起点 y 坐标（不传则使用屏幕中心） */
  y?: number
}

// ==================== 内部工具函数 ====================

/**
 * 检测浏览器是否支持 View Transitions API
 */
function supportsViewTransitions(): boolean {
  return typeof document !== "undefined" && "startViewTransition" in document && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * 计算扩散动画的最大半径
 * 确保圆形能够覆盖整个屏幕
 */
function calculateMaxRadius(x: number, y: number): number {
  const { innerWidth, innerHeight } = window
  // 计算到四个角的距离，取最大值
  const distances = [
    Math.hypot(x, y), // 左上角
    Math.hypot(innerWidth - x, y), // 右上角
    Math.hypot(x, innerHeight - y), // 左下角
    Math.hypot(innerWidth - x, innerHeight - y), // 右下角
  ]
  return Math.max(...distances)
}

/**
 * 获取当前主题
 */
export function getCurrentTheme(): ThemeMode {
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

/**
 * 应用主题到 DOM（不带动画）
 */
export function applyTheme(theme: ThemeMode): void {
  const html = document.documentElement
  html.classList.toggle("dark", theme === "dark")
  html.setAttribute("data-theme", theme)
}

// ==================== 核心切换函数 ====================

/**
 * 切换主题（带圆形扩散动画）
 *
 * @param theme - 目标主题，不传则自动切换
 * @param options - 配置选项
 * @returns Promise，动画完成后 resolve
 *
 * @example
 * // 基本用法：自动切换主题
 * await toggleTheme()
 *
 * @example
 * // 指定主题
 * await toggleTheme('dark')
 *
 * @example
 * // 从点击位置开始动画
 * button.addEventListener('click', (e) => {
 *   toggleTheme(undefined, { x: e.clientX, y: e.clientY })
 * })
 *
 * @example
 * // 禁用动画
 * await toggleTheme('light', { enableAnimation: false })
 */
export async function toggleTheme(theme?: ThemeMode, options: ThemeToggleOptions = {}): Promise<void> {
  const { enableAnimation = true, duration = 500, x = window.innerWidth / 2, y = window.innerHeight / 2 } = options

  // 确定目标主题
  const currentTheme = getCurrentTheme()
  const targetTheme = theme ?? (currentTheme === "light" ? "dark" : "light")

  // 如果主题相同，无需切换
  if (targetTheme === currentTheme) {
    return
  }

  // 不支持动画或禁用动画时，直接切换
  if (!enableAnimation || !supportsViewTransitions()) {
    applyTheme(targetTheme)
    return
  }

  // 计算动画参数
  const maxRadius = calculateMaxRadius(x, y)
  const isDark = targetTheme === "dark"

  // 注入动画样式（必须在 startViewTransition 之前注入）
  const styleId = "theme-transition-style"
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null

  if (!styleEl) {
    styleEl = document.createElement("style")
    styleEl.id = styleId
    document.head.appendChild(styleEl)
  }

  // 设置动画 CSS
  // 暗色模式：新主题从中心扩散出来，起步慢后面快（ease-in）
  // 亮色模式：旧主题从中心收缩消失，起步快后面慢（ease-out）
  const easingIn = "cubic-bezier(0.4, 0, 0.8, 1)" // 起步慢，后面快
  const easingOut = "cubic-bezier(0.2, 0, 0.4, 1)" // 起步快，后面慢

  styleEl.textContent = `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }

    ${
      isDark
        ? `
    /* 切换到暗色模式：新主题从点击位置扩散，起步慢后面快 */
    ::view-transition-old(root) {
      z-index: 1;
    }
    
    ::view-transition-new(root) {
      z-index: 9999;
      clip-path: circle(0px at ${x}px ${y}px);
      animation: circle-expand ${duration}ms ${easingIn} forwards;
    }
    
    @keyframes circle-expand {
      0% {
        clip-path: circle(0px at ${x}px ${y}px);
      }
      100% {
        clip-path: circle(${maxRadius}px at ${x}px ${y}px);
      }
    }
    `
        : `
    /* 切换到亮色模式：旧主题从点击位置收缩，起步快后面慢 */
    ::view-transition-old(root) {
      z-index: 9999;
      clip-path: circle(${maxRadius}px at ${x}px ${y}px);
      animation: circle-shrink ${duration}ms ${easingOut} forwards;
    }
    
    ::view-transition-new(root) {
      z-index: 1;
    }
    
    @keyframes circle-shrink {
      0% {
        clip-path: circle(${maxRadius}px at ${x}px ${y}px);
      }
      100% {
        clip-path: circle(0px at ${x}px ${y}px);
      }
    }
    `
    }
  `

  // 使用 View Transitions API 执行动画（样式已准备好）
  const transition = (document as any).startViewTransition(() => {
    applyTheme(targetTheme)
  })

  // 等待动画完成后清理样式
  try {
    await transition.finished
  } finally {
    // 延迟清理，确保动画完全结束
    setTimeout(() => {
      if (styleEl) {
        styleEl.textContent = ""
      }
    }, 50)
  }
}

/**
 * 设置指定主题（带动画）
 *
 * @param theme - 目标主题
 * @param options - 配置选项
 */
export async function setTheme(theme: ThemeMode, options?: ThemeToggleOptions): Promise<void> {
  return toggleTheme(theme, options)
}

/**
 * 初始化主题（不带动画，适合应用启动时调用）
 *
 * @param theme - 目标主题，不传则使用系统偏好
 */
export function initTheme(theme?: ThemeMode): void {
  const targetTheme = theme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  applyTheme(targetTheme)
}

// ==================== 便捷方法 ====================

/**
 * 创建绑定点击事件的主题切换处理器
 * 自动从点击位置开始动画
 *
 * @param options - 配置选项（x, y 会被自动覆盖）
 * @returns 点击事件处理函数
 *
 * @example
 * <button @click="createThemeToggleHandler()">切换主题</button>
 *
 * @example
 * // 自定义配置
 * <button @click="createThemeToggleHandler({ duration: 600 })">切换主题</button>
 */
export function createThemeToggleHandler(options: Omit<ThemeToggleOptions, "x" | "y"> = {}) {
  return (event: MouseEvent) => {
    toggleTheme(undefined, {
      ...options,
      x: event.clientX,
      y: event.clientY,
    })
  }
}
