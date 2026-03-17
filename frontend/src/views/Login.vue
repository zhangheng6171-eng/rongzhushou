<template>
  <div class="login-page">
    <!-- 背景动画 -->
    <div class="login-bg">
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>
      <div class="bg-gradient"></div>
    </div>

    <div class="login-container">
      <div class="login-left">
        <div class="login-illustration">
          <div class="illustration-circles">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
          </div>
          <div class="illustration-content">
            <div class="welcome-icon">👋</div>
            <h2>欢迎回来</h2>
            <p>登录您的账户，享受AI智能融资服务</p>
          </div>
          <div class="floating-elements">
            <span class="float-item fi-1">💰</span>
            <span class="float-item fi-2">📊</span>
            <span class="float-item fi-3">🏦</span>
            <span class="float-item fi-4">💼</span>
          </div>
        </div>
      </div>
      
      <div class="login-right">
        <div class="login-box">
          <div class="login-header">
            <router-link to="/" class="logo">
              <span class="logo-icon">融</span>
              <span class="logo-text">融智助手</span>
            </router-link>
            <h3>登录账户</h3>
          </div>
          
          <el-tabs v-model="activeTab" class="login-tabs">
            <el-tab-pane label="验证码登录" name="sms">
              <el-form ref="smsFormRef" :model="smsForm" :rules="smsRules" class="login-form">
                <el-form-item prop="phone">
                  <div class="input-wrapper" :class="{ focused: phoneFocus }">
                    <span class="input-icon">📱</span>
                    <el-input
                      v-model="smsForm.phone"
                      placeholder="请输入手机号"
                      @focus="phoneFocus = true"
                      @blur="phoneFocus = false"
                    />
                  </div>
                </el-form-item>
                <el-form-item prop="code">
                  <div class="code-input">
                    <div class="input-wrapper" :class="{ focused: codeFocus }">
                      <span class="input-icon">🔐</span>
                      <el-input
                        v-model="smsForm.code"
                        placeholder="请输入验证码"
                        @focus="codeFocus = true"
                        @blur="codeFocus = false"
                      />
                    </div>
                    <el-button
                      :disabled="countdown > 0"
                      @click="sendCode"
                      type="primary"
                      class="code-btn"
                    >
                      <span v-if="countdown > 0">{{ countdown }}s</span>
                      <span v-else>获取验证码</span>
                    </el-button>
                  </div>
                </el-form-item>
                <el-form-item>
                  <button
                    type="button"
                    class="login-btn"
                    @click="handleSmsLogin"
                    :disabled="loading"
                  >
                    <span class="btn-content">
                      <span v-if="loading" class="loading-spinner"></span>
                      <span>{{ loading ? '登录中...' : '登录' }}</span>
                      <svg v-if="!loading" class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            
            <el-tab-pane label="密码登录" name="password">
              <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" class="login-form">
                <el-form-item prop="phone">
                  <div class="input-wrapper" :class="{ focused: pwdPhoneFocus }">
                    <span class="input-icon">📱</span>
                    <el-input
                      v-model="pwdForm.phone"
                      placeholder="请输入手机号"
                      @focus="pwdPhoneFocus = true"
                      @blur="pwdPhoneFocus = false"
                    />
                  </div>
                </el-form-item>
                <el-form-item prop="password">
                  <div class="input-wrapper" :class="{ focused: pwdFocus }">
                    <span class="input-icon">🔒</span>
                    <el-input
                      v-model="pwdForm.password"
                      type="password"
                      placeholder="请输入密码"
                      show-password
                      @focus="pwdFocus = true"
                      @blur="pwdFocus = false"
                    />
                  </div>
                </el-form-item>
                <el-form-item>
                  <div class="form-actions">
                    <el-checkbox v-model="rememberMe">记住我</el-checkbox>
                    <a href="#" class="forgot-link">忘记密码？</a>
                  </div>
                </el-form-item>
                <el-form-item>
                  <button
                    type="button"
                    class="login-btn"
                    @click="handlePwdLogin"
                    :disabled="loading"
                  >
                    <span class="btn-content">
                      <span v-if="loading" class="loading-spinner"></span>
                      <span>{{ loading ? '登录中...' : '登录' }}</span>
                      <svg v-if="!loading" class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
          
          <div class="divider">
            <span>其他登录方式</span>
          </div>
          
          <div class="social-login">
            <button class="social-btn wechat" @click="handleWechatLogin">
              <span class="social-icon">💬</span>
              <span>微信登录</span>
            </button>
          </div>
          
          <div class="login-footer">
            <p>还没有账户？ <router-link to="/register">立即注册</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { userApi } from '../api'
import { isValidPhone } from '../utils'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('sms')
const loading = ref(false)
const countdown = ref(0)
const rememberMe = ref(false)

// 输入框焦点状态
const phoneFocus = ref(false)
const codeFocus = ref(false)
const pwdPhoneFocus = ref(false)
const pwdFocus = ref(false)

const smsFormRef = ref()
const pwdFormRef = ref()

const smsForm = reactive({
  phone: '',
  code: ''
})

const pwdForm = reactive({
  phone: '',
  password: ''
})

const smsRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ]
}

const pwdRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

const sendCode = async () => {
  if (!isValidPhone(smsForm.phone)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  
  try {
    await userApi.sendSms(smsForm.phone)
    ElMessage.success('验证码已发送')
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (error) {
    console.error('发送验证码失败:', error)
  }
}

const handleSmsLogin = async () => {
  const valid = await smsFormRef.value?.validate()
  if (!valid) return
  
  loading.value = true
  try {
    const res = await userApi.login({
      phone: smsForm.phone,
      code: smsForm.code,
      type: 'sms'
    })
    userStore.setToken(res.token)
    userStore.setUserInfo(res.user)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePwdLogin = async () => {
  const valid = await pwdFormRef.value?.validate()
  if (!valid) return
  
  loading.value = true
  try {
    const res = await userApi.login({
      phone: pwdForm.phone,
      password: pwdForm.password,
      type: 'password'
    })
    userStore.setToken(res.token)
    userStore.setUserInfo(res.user)
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}

const handleWechatLogin = () => {
  ElMessage.info('微信登录功能即将上线')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  position: relative;
  overflow: hidden;
}

/* 背景动画 */
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
}

.bg-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  animation: floatShape 20s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -50px;
  animation-delay: -5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: -50px;
  left: 30%;
  animation-delay: -10s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  top: 30%;
  left: 20%;
  animation-delay: -15s;
}

.shape-5 {
  width: 80px;
  height: 80px;
  bottom: 30%;
  right: 25%;
  animation-delay: -7s;
}

@keyframes floatShape {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(30px, 30px) rotate(90deg); }
  50% { transform: translate(0, 60px) rotate(180deg); }
  75% { transform: translate(-30px, 30px) rotate(270deg); }
}

/* 登录容器 */
.login-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  margin: 20px;
  background: #fff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

/* 左侧装饰 */
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}

.login-illustration {
  position: relative;
  text-align: center;
  color: #fff;
  z-index: 2;
}

.illustration-circles {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: pulse 4s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: -1s;
}

.circle-3 {
  width: 400px;
  height: 400px;
  top: -200px;
  left: -200px;
  animation-delay: -2s;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.05); opacity: 0.5; }
}

.illustration-content {
  position: relative;
  z-index: 2;
}

.welcome-icon {
  font-size: 60px;
  margin-bottom: 20px;
  animation: wave 2s ease-in-out infinite;
  display: inline-block;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-20deg); }
}

.illustration-content h2 {
  font-size: 36px;
  margin-bottom: 15px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

.illustration-content p {
  font-size: 16px;
  opacity: 0.9;
}

.floating-elements {
  position: absolute;
  width: 400px;
  height: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.float-item {
  position: absolute;
  font-size: 30px;
  animation: float 6s ease-in-out infinite;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));
}

.fi-1 { top: 10%; left: 20%; animation-delay: 0s; }
.fi-2 { top: 20%; right: 15%; animation-delay: -1.5s; }
.fi-3 { bottom: 25%; left: 10%; animation-delay: -3s; }
.fi-4 { bottom: 15%; right: 20%; animation-delay: -4.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

/* 右侧表单 */
.login-right {
  flex: 1;
  padding: 60px;
  display: flex;
  align-items: center;
  background: #fff;
}

.login-box {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header .logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  margin-bottom: 25px;
}

.login-header .logo-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  margin-right: 12px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.login-header .logo-text {
  font-size: 26px;
  font-weight: 600;
  color: #303133;
}

.login-header h3 {
  font-size: 18px;
  color: #909399;
  font-weight: normal;
}

/* 标签页 */
.login-tabs {
  margin-bottom: 25px;
}

.login-tabs :deep(.el-tabs__header) {
  margin-bottom: 30px;
}

.login-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.login-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  padding: 0 20px;
  height: 50px;
  line-height: 50px;
}

.login-tabs :deep(.el-tabs__item.is-active) {
  color: #667eea;
  font-weight: 600;
}

.login-tabs :deep(.el-tabs__active-bar) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 3px;
  border-radius: 2px;
}

/* 表单 */
.login-form :deep(.el-form-item) {
  margin-bottom: 25px;
}

/* 输入框包装 */
.input-wrapper {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 12px;
  padding: 0 15px;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.input-wrapper.focused {
  background: #fff;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.input-icon {
  font-size: 18px;
  margin-right: 10px;
  transition: transform 0.3s;
}

.input-wrapper.focused .input-icon {
  transform: scale(1.1);
}

.input-wrapper :deep(.el-input__wrapper) {
  background: transparent;
  box-shadow: none;
  padding: 15px 0;
}

.input-wrapper :deep(.el-input__inner) {
  font-size: 15px;
}

/* 验证码输入 */
.code-input {
  display: flex;
  gap: 12px;
}

.code-input .input-wrapper {
  flex: 1;
}

.code-btn {
  width: 120px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  font-size: 14px;
  transition: all 0.3s;
}

.code-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.code-btn:disabled {
  opacity: 0.7;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 26px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.3s;
}

.login-btn:hover .btn-arrow {
  transform: translateX(3px);
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}

.form-actions :deep(.el-checkbox__label) {
  color: #606266;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.forgot-link:hover {
  color: #764ba2;
}

/* 分割线 */
.divider {
  text-align: center;
  margin: 30px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 35%;
  height: 1px;
  background: #e4e7ed;
}

.divider::before { left: 0; }
.divider::after { right: 0; }

.divider span {
  background: #fff;
  padding: 0 15px;
  color: #909399;
  font-size: 14px;
}

/* 社交登录 */
.social-login {
  display: flex;
  justify-content: center;
}

.social-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 30px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 15px;
}

.social-btn.wechat {
  background: #07c160;
  color: #fff;
}

.social-btn.wechat:hover {
  background: #06ad56;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(7, 193, 96, 0.3);
}

.social-icon {
  font-size: 18px;
}

/* 页脚 */
.login-footer {
  text-align: center;
  margin-top: 30px;
  color: #909399;
  font-size: 14px;
}

.login-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.login-footer a:hover {
  color: #764ba2;
}

/* 响应式 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    margin: 0;
    border-radius: 0;
  }
  
  .login-left {
    padding: 50px 20px;
    min-height: auto;
  }
  
  .login-right {
    padding: 40px 20px;
  }
  
  .illustration-content h2 {
    font-size: 28px;
  }
  
  .floating-elements {
    display: none;
  }
  
  .login-tabs :deep(.el-tabs__item) {
    font-size: 15px;
    padding: 0 15px;
  }
}
</style>
