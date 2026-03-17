<template>
  <header class="navbar" :class="{ scrolled: isScrolled }">
    <div class="container navbar-content">
      <router-link to="/" class="logo" @mouseenter="logoHover = true" @mouseleave="logoHover = false">
        <span class="logo-icon" :class="{ hover: logoHover }">融</span>
        <span class="logo-text">融智助手</span>
      </router-link>
      
      <nav class="nav-menu" :class="{ 'nav-open': mobileMenuOpen }">
        <router-link 
          v-for="(item, index) in navItems" 
          :key="item.path"
          :to="item.path" 
          class="nav-link"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.name }}</span>
        </router-link>
      </nav>
      
      <div class="nav-actions">
        <template v-if="userStore.isLoggedIn()">
          <el-dropdown @command="handleCommand" trigger="click" class="user-dropdown">
            <span class="user-info">
              <el-avatar :size="36" :src="userStore.userInfo?.avatar" class="user-avatar">
                {{ userStore.userInfo?.nickname?.charAt(0) || '用户' }}
              </el-avatar>
              <span class="username">{{ userStore.userInfo?.nickname || '用户' }}</span>
              <span class="dropdown-arrow">▼</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu class="user-dropdown-menu">
                <el-dropdown-item command="dashboard">
                  <span class="menu-icon">👤</span>
                  用户中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <span class="menu-icon">⚙️</span>
                  账号设置
                </el-dropdown-item>
                <el-dropdown-item command="membership">
                  <span class="menu-icon">👑</span>
                  会员服务
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <span class="menu-icon">🚪</span>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <router-link to="/login" class="btn-login">
            <span class="btn-text">登录</span>
          </router-link>
          <router-link to="/register" class="btn-register">
            <span class="btn-text">注册</span>
            <span class="btn-shine"></span>
          </router-link>
        </template>
      </div>
      
      <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{ active: mobileMenuOpen }">
        <span class="hamburger">
          <span class="line line-1"></span>
          <span class="line line-2"></span>
          <span class="line line-3"></span>
        </span>
      </button>
    </div>
    
    <!-- 移动端菜单遮罩 -->
    <Transition name="fade">
      <div class="mobile-menu-overlay" v-if="mobileMenuOpen" @click="closeMobileMenu"></div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const logoHover = ref(false)

const navItems = [
  { name: '首页', path: '/', icon: '🏠' },
  { name: '资讯中心', path: '/articles', icon: '📰' },
  { name: 'AI顾问', path: '/ai-counselor', icon: '🤖' },
  { name: '贷款计算器', path: '/loan-calculator', icon: '📊' },
  { name: '会员服务', path: '/membership', icon: '👑' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : ''
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const handleCommand = (command) => {
  closeMobileMenu()
  if (command === 'logout') {
    userStore.logout()
    router.push('/')
  } else if (command === 'dashboard') {
    router.push('/dashboard')
  } else if (command === 'settings') {
    router.push('/settings')
  } else if (command === 'membership') {
    router.push('/membership')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 12px;
}

.logo-icon {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.logo-icon.hover {
  transform: rotate(-10deg) scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
  letter-spacing: -0.5px;
}

/* 导航菜单 */
.nav-menu {
  display: flex;
  gap: 8px;
}

.nav-link {
  color: #606266;
  text-decoration: none;
  font-size: 15px;
  padding: 10px 18px;
  border-radius: 10px;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-icon {
  font-size: 16px;
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.3s ease;
}

.nav-link:hover .nav-icon,
.nav-link.router-link-active .nav-icon {
  opacity: 1;
  transform: translateX(0);
}

.nav-link:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
}

.nav-link.router-link-active {
  color: #667eea;
  font-weight: 500;
  background: rgba(102, 126, 234, 0.08);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

/* 用户操作 */
.nav-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-login {
  color: #667eea;
  text-decoration: none;
  font-size: 15px;
  padding: 10px 22px;
  border: 2px solid #667eea;
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-login:hover {
  background: #667eea;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-register {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  text-decoration: none;
  font-size: 15px;
  padding: 10px 22px;
  border-radius: 25px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

/* 用户下拉 */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(102, 126, 234, 0.08);
}

.user-avatar {
  border: 2px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.user-info:hover .user-avatar {
  border-color: #667eea;
}

.username {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 10px;
  color: #909399;
  transition: transform 0.3s ease;
}

.user-info:hover .dropdown-arrow {
  transform: rotate(180deg);
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  width: 44px;
  height: 44px;
  background: #f5f7fa;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: #eee;
}

.hamburger {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.line {
  width: 100%;
  height: 2px;
  background: #303133;
  border-radius: 1px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.mobile-menu-btn.active .line-1 {
  transform: rotate(45deg) translateY(4px);
}

.mobile-menu-btn.active .line-2 {
  opacity: 0;
  transform: scaleX(0);
}

.mobile-menu-btn.active .line-3 {
  transform: rotate(-45deg) translateY(-4px);
}

/* 移动端菜单遮罩 */
.mobile-menu-overlay {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 99;
}

/* 响应式 */
@media (max-width: 992px) {
  .nav-link {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .nav-icon {
    display: none;
  }
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .nav-menu {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: #fff;
    flex-direction: column;
    padding: 20px;
    gap: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 100;
  }
  
  .nav-menu.nav-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .nav-link {
    padding: 15px 20px;
    border-radius: 12px;
    font-size: 16px;
    background: #f5f7fa;
  }
  
  .nav-link:hover,
  .nav-link.router-link-active {
    background: rgba(102, 126, 234, 0.1);
  }
  
  .nav-icon {
    display: inline;
    opacity: 1;
    transform: none;
  }
  
  .nav-link.router-link-active::after {
    display: none;
  }
  
  .nav-actions {
    display: none;
  }
}

/* 下拉菜单样式 */
:deep(.user-dropdown-menu) {
  border-radius: 16px;
  padding: 8px;
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  min-width: 160px;
}

:deep(.el-dropdown-menu__item) {
  border-radius: 10px;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  transition: all 0.2s ease;
}

:deep(.el-dropdown-menu__item:hover) {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
}

.menu-icon {
  font-size: 16px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
