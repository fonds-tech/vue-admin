<template>
  <el-card shadow="hover" class="project-card">
    <div class="project-content">
      <div class="info-section">
        <h3 class="title">关于项目</h3>
        <p class="desc">
          Art Design Pro 是一款兼具设计美学与高效开发的后台系统<br />
          使用了 Vue3、TypeScript、Vite、Element Plus 等前沿技术
        </p>
        <div class="links">
          <div class="link-group">
            <a href="#" class="link-item">
              <span>项目官网</span>
              <el-icon><ArrowRight /></el-icon>
            </a>
            <a href="#" class="link-item">
              <span>Github</span>
              <el-icon><ArrowRight /></el-icon>
            </a>
          </div>
          <div class="link-group">
            <a href="#" class="link-item">
              <span>文档</span>
              <el-icon><ArrowRight /></el-icon>
            </a>
            <a href="#" class="link-item">
              <span>哔哩哔哩</span>
              <el-icon><ArrowRight /></el-icon>
            </a>
          </div>
        </div>
      </div>
      <div class="image-section">
        <img src="https://cdna.art-design.ui.com/dashboard/workbench-illustration.png" alt="Illustration" class="illustration" />
        <!-- Fallback or decorative SVG if image fails or for placeholder -->
        <div class="illustration-placeholder"></div>
      </div>
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.project-card {
  color: #fff;
  border: 1px solid var(--el-border-color-light);
  background: #1d1e1f;
  transition: all 0.3s;
  border-radius: 4px;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  }

  :deep(.el-card__body) {
    padding: 0;
  }

  .project-content {
    height: 300px;
    display: flex;
    padding: 30px;
    overflow: hidden;
    position: relative;
    align-items: center;
    justify-content: space-between;

    .info-section {
      z-index: 1;

      .title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 16px;
      }

      .desc {
        color: #909399;
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 30px;
      }

      .links {
        gap: 20px;
        display: flex;

        .link-group {
          gap: 12px;
          display: flex;
          flex-direction: column;

          .link-item {
            color: #e5eaf3;
            width: 160px;
            display: flex;
            padding: 10px 16px;
            font-size: 14px;
            background: rgb(255 255 255 / 5%);
            transition: background 0.3s;
            align-items: center;
            border-radius: 4px;
            justify-content: space-between;
            text-decoration: none;

            &:hover {
              background: rgb(255 255 255 / 10%);
            }
          }
        }
      }
    }

    .image-section {
      right: 0;
      width: 50%;
      bottom: 0;
      height: 100%;
      position: absolute;

      .illustration-placeholder {
        // Placeholder graphic simulation using CSS gradient if image is missing
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at bottom right, rgb(64 158 255 / 20%), transparent 70%);
      }
    }
  }
}
</style>
