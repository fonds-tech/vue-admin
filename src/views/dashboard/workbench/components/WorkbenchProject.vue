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
  background: #1d1e1f;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  }

  :deep(.el-card__body) {
    padding: 0;
  }

  .project-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 300px;
    padding: 30px;
    overflow: hidden;

    .info-section {
      z-index: 1;

      .title {
        margin-bottom: 16px;
        font-size: 24px;
        font-weight: 600;
      }

      .desc {
        margin-bottom: 30px;
        font-size: 14px;
        line-height: 1.6;
        color: #909399;
      }

      .links {
        display: flex;
        gap: 20px;

        .link-group {
          display: flex;
          flex-direction: column;
          gap: 12px;

          .link-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 160px;
            padding: 10px 16px;
            font-size: 14px;
            color: #e5eaf3;
            text-decoration: none;
            background: rgb(255 255 255 / 5%);
            border-radius: 4px;
            transition: background 0.3s;

            &:hover {
              background: rgb(255 255 255 / 10%);
            }
          }
        }
      }
    }

    .image-section {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 50%;
      height: 100%;

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
