<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1>页面找不到了</h1>
        <p>抱歉，您访问的页面不存在或已被移除</p>
        <div class="actions">
          <el-button type="primary" size="large" @click="$router.push('/')">
            返回首页
          </el-button>
          <el-button size="large" @click="$router.go(-1)">
            返回上一页
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 404页面
</script>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.not-found-content {
  text-align: center;
  padding: 40px;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 20px;
}

.not-found-content h1 {
  font-size: 32px;
  color: #303133;
  margin-bottom: 15px;
}

.not-found-content p {
  color: #909399;
  font-size: 16px;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }

  .not-found-content h1 {
    font-size: 24px;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
