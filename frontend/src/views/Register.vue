<template>
  <div class="register-page">
    <!-- 背景动画 -->
    <div class="register-bg">
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>
      <div class="bg-gradient"></div>
    </div>

    <div class="register-container">
      <div class="register-left">
        <div class="register-illustration">
          <div class="illustration-circles">
            <div class="circle circle-1"></div>
            <div class="circle circle-2"></div>
            <div class="circle circle-3"></div>
          </div>
          <div class="illustration-content">
            <div class="welcome-icon">🚀</div>
            <h2>加入融智</h2>
            <p>注册账户，开启智能融资之旅</p>
          </div>
          <div class="floating-elements">
            <span class="float-item fi-1">💡</span>
            <span class="float-item fi-2">🎯</span>
            <span class="float-item fi-3">📈</span>
            <span class="float-item fi-4">⭐</span>
          </div>
        </div>
      </div>
      
      <div class="register-right">
        <div class="register-box">
          <div class="register-header">
            <router-link to="/" class="logo">
              <span class="logo-icon">融</span>
              <span class="logo-text">融智助手</span>
            </router-link>
            <h3>注册账户</h3>
          </div>
          
          <el-form ref="formRef" :model="form" :rules="rules" class="register-form">
            <el-form-item prop="phone">
              <div class="input-wrapper" :class="{ focused: phoneFocus, error: phoneError }">
                <span class="input-icon">📱</span>
                <el-input
                  v-model="form.phone"
                  placeholder="请输入手机号"
                  @focus="phoneFocus = true"
                  @blur="handlePhoneBlur"
                />
                <transition name="fade">
                  <span class="status-icon valid" v-if="phoneValid">✓</span>
                </transition>
              </div>
            </el-form-item>
            
            <el-form-item prop="code">
              <div class="code-input">
                <div class="input-wrapper" :class="{ focused: codeFocus }">
                  <span class="input-icon">🔐</span>
                  <el-input
                    v-model="form.code"
                    placeholder="请输入验证码"
                    @focus="codeFocus = true"
                    @blur="codeFocus = false"
                  />
                </div>
                <el-button
                  :disabled="countdown > 0 || !phoneValid"
                  @click="sendCode"
                  type="primary"
                  class="code-btn"
                >
                  <span v-if="countdown > 0">{{ countdown }}s</span>
                  <span v-else>获取验证码</span>
                </el-button>
              </div>
            </el-form-item>
            
            <el-form-item prop="password">
              <div class="input-wrapper" :class="{ focused: pwdFocus }">
                <span class="input-icon">🔒</span>
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="设置登录密码（至少6位）"
                  show-password
                  @focus="pwdFocus = true"
                  @blur="pwdFocus = false"
                  @input="checkPasswordStrength"
                />
              </div>
              <!-- 密码强度指示器 -->
              <transition name="slide-down">
                <div class="password-strength" v-if="form.password">
                  <div class="strength-bars">
                    <div 
                      v-for="i in 4" 
                      :key="i" 
                      class="strength-bar"
                      :class="{ active: i <= passwordStrength }"
                    ></div>
                  </div>
                  <span class="strength-text" :class="strengthClass">{{ strengthText }}</span>
                </div>
              </transition>
            </el-form-item>
            
            <el-form-item prop="confirmPassword">
              <div class="input-wrapper" :class="{ focused: confirmFocus, error: confirmError }">
                <span class="input-icon">🔐</span>
                <el-input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  show-password
                  @focus="confirmFocus = true"
                  @blur="handleConfirmBlur"
                  @input="checkConfirmPassword"
                />
                <transition name="fade">
                  <span class="status-icon valid" v-if="confirmValid">✓</span>
                </transition>
              </div>
            </el-form-item>
            
            <el-form-item prop="agreement">
              <div class="agreement-wrapper">
                <el-checkbox v-model="form.agreement" class="agreement-checkbox">
                  我已阅读并同意 <a href="#" @click.prevent>《用户协议》</a> 和 <a href="#" @click.prevent>《隐私政策》</a>
                </el-checkbox>
              </div>
            </el-form-item>
            
            <el-form-item>
              <button
                type="button"
                class="register-btn"
                @click="handleRegister"
                :disabled="loading || !form.agreement"
              >
                <span class="btn-content">
                  <span v-if="loading" class="loading-spinner"></span>
                  <span>{{ loading ? '注册中...' : '立即注册' }}</span>
                  <svg v-if="!loading" class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </button>
            </el-form-item>
          </el-form>
          
          <div class="register-footer">
            <p>已有账户？ <router-link to="/login">立即登录</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { userApi } from '../api'
import { isValidPhone } from '../utils'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref()
const loading = ref(false)
const countdown = ref(0)

// 输入框焦点状态
const phoneFocus = ref(false)
const codeFocus = ref(false)
const pwdFocus = ref(false)
const confirmFocus = ref(false)

// 验证状态
const phoneValid = ref(false)
const phoneError = ref(false)
const confirmValid = ref(false)
const confirmError = ref(false)

// 密码强度
const passwordStrength = ref(0)

const form = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const validateAgreement = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请阅读并同意用户协议'))
  } else {
    callback()
  }
}

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码为6位数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请设置登录密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  agreement: [
    { validator: validateAgreement, trigger: 'change' }
  ]
}

// 密码强度检测
const checkPasswordStrength = () => {
  const pwd = form.password
  let strength = 0
  
  if (pwd.length >= 6) strength++
  if (pwd.length >= 10) strength++
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) strength++
  if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) strength++
  
  passwordStrength.value = strength
}

const strengthClass = computed(() => {
  const classes = ['', 'weak', 'weak', 'medium', 'strong']
  return classes[passwordStrength.value]
})

const strengthText = computed(() => {
  const texts = ['', '弱', '较弱', '中等', '强']
  return texts[passwordStrength.value]
})

const handlePhoneBlur = () => {
  phoneFocus.value = false
  phoneValid.value = isValidPhone(form.phone)
  phoneError.value = form.phone && !phoneValid.value
}

const checkConfirmPassword = () => {
  if (form.confirmPassword) {
    confirmValid.value = form.confirmPassword === form.password
    confirmError.value = !confirmValid.value
  }
}

const handleConfirmBlur = () => {
  confirmFocus.value = false
  checkConfirmPassword()
}

const sendCode = async () => {
  if (!phoneValid.value) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  
  try {
    await userApi.sendSms(form.phone)
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

const handleRegister = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return
  
  loading.value = true
  try {
    const res = await userApi.register({
      phone: form.phone,
      code: form.code,
      password: form.password
    })
    userStore.setToken(res.token)
    userStore.setUserInfo(res.user)
    ElMessage.success('注册成功')
    router.push('/dashboard')
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  position: relative;
  overflow: hidden;
  padding: 40px 0;
}

/* 背景动画 */
.register-bg {
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
  right: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 10%;
  left: -50px;
  animation-delay: -5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 30%;
  right: 20%;
  animation-delay: -10s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 30%;
  left: 15%;
  animation-delay: -15s;
}

@keyframes floatShape {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(30px, 30px) rotate(90deg); }
  50% { transform: translate(0, 60px) rotate(180deg); }
  75% { transform: translate(-30px, 30px) rotate(270deg); }
}

/* 注册容器 */
.register-container {
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
.register-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}

.register-illustration {
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
  animation: bounce 2s ease-in-out infinite;
  display: inline-block;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
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

.fi-1 { top: 5%; left: 25%; animation-delay: 0s; }
.fi-2 { top: 15%; right: 10%; animation-delay: -1.5s; }
.fi-3 { bottom: 20%; left: 15%; animation-delay: -3s; }
.fi-4 { bottom: 10%; right: 25%; animation-delay: -4.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

/* 右侧表单 */
.register-right {
  flex: 1;
  padding: 50px 60px;
  display: flex;
  align-items: center;
  background: #fff;
  overflow-y: auto;
  max-height: calc(100vh - 80px);
}

.register-box {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

.register-header {
  text-align: center;
  margin-bottom: 35px;
}

.register-header .logo {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  margin-bottom: 20px;
}

.register-header .logo-icon {
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

.register-header .logo-text {
  font-size: 26px;
  font-weight: 600;
  color: #303133;
}

.register-header h3 {
  font-size: 18px;
  color: #909399;
  font-weight: normal;
}

/* 表单 */
.register-form :deep(.el-form-item) {
  margin-bottom: 22px;
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
  position: relative;
}

.input-wrapper.focused {
  background: #fff;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.input-wrapper.error {
  border-color: #f56c6c;
  background: #fef0f0;
}

.input-icon {
  font-size: 18px;
  margin-right: 10px;
  transition: transform 0.3s;
}

.input-wrapper.focused .input-icon {
  transform: scale(1.1);
}

.status-icon {
  font-size: 16px;
  position: absolute;
  right: 15px;
}

.status-icon.valid {
  color: #67c23a;
}

.input-wrapper :deep(.el-input__wrapper) {
  background: transparent;
  box-shadow: none;
  padding: 14px 0;
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

/* 密码强度指示器 */
.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.strength-bars {
  display: flex;
  gap: 4px;
}

.strength-bar {
  width: 30px;
  height: 4px;
  background: #e4e7ed;
  border-radius: 2px;
  transition: all 0.3s;
}

.strength-bar.active {
  background: #f56c6c;
}

.strength-bar.active:nth-child(-n+2) {
  background: #f56c6c;
}

.strength-bar.active:nth-child(3) {
  background: #e6a23c;
}

.strength-bar.active:nth-child(4) {
  background: #67c23a;
}

.strength-text {
  font-size: 12px;
}

.strength-text.weak { color: #f56c6c; }
.strength-text.medium { color: #e6a23c; }
.strength-text.strong { color: #67c23a; }

/* 协议 */
.agreement-wrapper {
  width: 100%;
}

.agreement-checkbox :deep(.el-checkbox__label) {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
}

.agreement-checkbox :deep(.el-checkbox__label a) {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s;
}

.agreement-checkbox :deep(.el-checkbox__label a:hover) {
  color: #764ba2;
}

/* 注册按钮 */
.register-btn {
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

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.register-btn:disabled {
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

.register-btn:hover .btn-arrow {
  transform: translateX(3px);
}

/* 页脚 */
.register-footer {
  text-align: center;
  margin-top: 25px;
  color: #909399;
  font-size: 14px;
}

.register-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.register-footer a:hover {
  color: #764ba2;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式 */
@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
    margin: 0;
    border-radius: 0;
  }
  
  .register-left {
    padding: 40px 20px;
    min-height: auto;
  }
  
  .register-right {
    padding: 30px 20px;
    max-height: none;
  }
  
  .illustration-content h2 {
    font-size: 28px;
  }
  
  .floating-elements {
    display: none;
  }
}
</style>
