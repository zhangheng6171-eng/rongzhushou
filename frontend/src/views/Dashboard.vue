<template>
  <div class="dashboard-page">
    <div class="container">
      <div class="dashboard-header">
        <div class="user-info">
          <el-avatar :size="80" :src="userStore.userInfo?.avatar">
            {{ userStore.userInfo?.nickname?.charAt(0) || '用户' }}
          </el-avatar>
          <div class="user-details">
            <h2>{{ userStore.userInfo?.nickname || '用户' }}</h2>
            <p>{{ userStore.userInfo?.phone }}</p>
          </div>
        </div>
        <el-button type="primary" @click="$router.push('/membership')">
          升级会员
        </el-button>
      </div>

      <el-row :gutter="20">
        <el-col :xs="24" :md="8">
          <div class="stat-card">
            <div class="stat-icon" style="background: #667eea">💰</div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.loanAmount }}</div>
              <div class="stat-label">累计融资金额</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :md="8">
          <div class="stat-card">
            <div class="stat-icon" style="background: #764ba2">📝</div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.consultCount }}</div>
              <div class="stat-label">咨询次数</div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :md="8">
          <div class="stat-card">
            <div class="stat-icon" style="background: #f56c6c">⭐</div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.memberLevel }}</div>
              <div class="stat-label">会员等级</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="dashboard-content">
        <el-col :xs="24" :md="16">
          <el-card class="content-card">
            <template #header>
              <span>最近咨询记录</span>
            </template>
            <el-table :data="recentChats" style="width: 100%">
              <el-table-column prop="question" label="问题" />
              <el-table-column prop="time" label="时间" width="180" />
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button type="primary" link @click="viewChat(row)">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :xs="24" :md="8">
          <el-card class="content-card">
            <template #header>
              <span>快速操作</span>
            </template>
            <div class="quick-actions">
              <el-button class="action-btn" @click="$router.push('/ai-counselor')">
                <span class="action-icon">🤖</span>
                <span>AI咨询</span>
              </el-button>
              <el-button class="action-btn" @click="$router.push('/loan-calculator')">
                <span class="action-icon">📊</span>
                <span>贷款计算</span>
              </el-button>
              <el-button class="action-btn" @click="$router.push('/articles')">
                <span class="action-icon">📰</span>
                <span>政策资讯</span>
              </el-button>
            </div>
          </el-card>

          <el-card class="content-card" style="margin-top: 20px">
            <template #header>
              <span>账户设置</span>
            </template>
            <el-menu>
              <el-menu-item @click="showEditProfile = true">
                <el-icon><User /></el-icon>
                <span>个人资料</span>
              </el-menu-item>
              <el-menu-item @click="showChangePassword = true">
                <el-icon><Lock /></el-icon>
                <span>修改密码</span>
              </el-menu-item>
              <el-menu-item @click="handleLogout">
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-menu-item>
            </el-menu>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 编辑资料弹窗 -->
    <el-dialog v-model="showEditProfile" title="编辑个人资料" width="400px">
      <el-form :model="profileForm" label-width="80px">
        <el-form-item label="昵称">
          <el-input v-model="profileForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditProfile = false">取消</el-button>
        <el-button type="primary" @click="saveProfile">保存</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="showChangePassword" title="修改密码" width="400px">
      <el-form :model="passwordForm" label-width="100px">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showChangePassword = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, SwitchButton } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const stats = reactive({
  loanAmount: '0万元',
  consultCount: 0,
  memberLevel: '普通用户'
})

const recentChats = ref([
  { id: 1, question: '小微企业如何申请低息贷款？', time: '2025-01-15 14:30' },
  { id: 2, question: '信用贷款需要什么条件？', time: '2025-01-14 10:20' },
  { id: 3, question: '贷款利率如何计算？', time: '2025-01-13 16:45' }
])

const showEditProfile = ref(false)
const showChangePassword = ref(false)

const profileForm = reactive({
  nickname: userStore.userInfo?.nickname || '',
  email: userStore.userInfo?.email || ''
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const viewChat = (row) => {
  router.push(`/ai-counselor?id=${row.id}`)
}

const saveProfile = () => {
  ElMessage.success('保存成功')
  showEditProfile.value = false
}

const changePassword = () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.error('两次密码不一致')
    return
  }
  ElMessage.success('密码修改成功')
  showChangePassword.value = false
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
  ElMessage.success('已退出登录')
}
</script>

<style scoped>
.dashboard-page {
  padding: 40px 0;
  min-height: calc(100vh - 70px);
  background: #f5f7fa;
}

.dashboard-header {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-details h2 {
  font-size: 24px;
  margin-bottom: 5px;
  color: #303133;
}

.user-details p {
  color: #909399;
  font-size: 14px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-content .stat-value {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.stat-content .stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.dashboard-content {
  margin-top: 20px;
}

.content-card {
  border-radius: 12px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
  padding: 0 20px;
  background: #f8f9fa;
  border: 1px solid #ebeef5;
}

.action-btn:hover {
  background: #667eea;
  color: #fff;
  border-color: #667eea;
}

.action-icon {
  font-size: 24px;
}
</style>
