<template>
  <div class="admin-page">
    <div class="admin-sidebar">
      <div class="admin-logo">
        <span>融</span>
        <span>管理后台</span>
      </div>
      <el-menu default-active="/admin" class="admin-menu" router>
        <el-menu-item index="/admin">
          <el-icon><HomeFilled /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/admin/articles">
          <el-icon><Document /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/consultations">
          <el-icon><ChatDotRound /></el-icon>
          <span>咨询记录</span>
        </el-menu-item>
        <el-menu-item index="/admin/orders">
          <el-icon><Money /></el-icon>
          <span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/settings">
          <el-icon><Setting /></el-icon>
          <span>系统设置</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="admin-main">
      <header class="admin-header">
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32">A</el-avatar>
              <span>管理员</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/')">返回前台</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>
      <main class="admin-content">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
        <div v-if="$route.path === '/admin'" class="dashboard-placeholder">
          <h2>管理后台</h2>
          <p>欢迎使用融智助手管理后台</p>
          <div class="stats-row">
            <el-card v-for="stat in stats" :key="stat.label" class="stat-card">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </el-card>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { HomeFilled, Document, User, ChatDotRound, Money, Setting } from '@element-plus/icons-vue'

const stats = ref([
  { label: '总用户数', value: 1234 },
  { label: '今日新增', value: 23 },
  { label: '总文章数', value: 56 },
  { label: '待处理咨询', value: 12 }
])
</script>

<style scoped>
.admin-page {
  display: flex;
  min-height: 100vh;
}

.admin-sidebar {
  width: 250px;
  background: #2c3e50;
  color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}

.admin-logo {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-logo span:first-child {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-menu {
  background: transparent;
  border: none;
  padding-top: 20px;
}

.admin-menu :deep(.el-menu-item) {
  color: #b0bec5;
}

.admin-menu :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.admin-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.admin-menu :deep(.el-icon) {
  color: inherit;
}

.admin-main {
  flex: 1;
  margin-left: 250px;
  background: #f5f7fa;
}

.admin-header {
  background: #fff;
  padding: 0 30px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.admin-content {
  padding: 30px;
}

.dashboard-placeholder {
  text-align: center;
  padding: 60px;
}

.dashboard-placeholder h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.dashboard-placeholder p {
  color: #909399;
  margin-bottom: 40px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  border-radius: 12px;
  text-align: center;
  padding: 20px;
}

.stat-value {
  font-size: 36px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 10px;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

@media (max-width: 768px) {
  .admin-sidebar {
    display: none;
  }
  
  .admin-main {
    margin-left: 0;
  }
  
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
