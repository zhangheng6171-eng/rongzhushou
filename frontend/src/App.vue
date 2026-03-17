<template>
  <div id="app">
    <!-- 页面加载动画 -->
    <Transition name="page-loading">
      <div v-if="pageLoading" class="page-loading-overlay">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <span class="loading-text">加载中...</span>
        </div>
      </div>
    </Transition>

    <NavBar v-if="!isAuthPage" />
    
    <router-view v-slot="{ Component, route }">
      <Transition :name="route.meta.transition || 'fade'" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </router-view>
    
    <Footer v-if="!isAuthPage" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const pageLoading = ref(true)

const isAuthPage = computed(() => {
  return ['/login', '/register'].includes(route.path)
})

// 模拟页面加载
onMounted(() => {
  setTimeout(() => {
    pageLoading.value = false
  }, 800)
})

// 路由变化时显示加载状态
watch(
  () => route.path,
  () => {
    pageLoading.value = true
    setTimeout(() => {
      pageLoading.value = false
    }, 300)
  }
)
</script>

<style>
/* 页面加载遮罩 */
.page-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner-ring {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 3px solid transparent;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.spinner-ring:nth-child(1) {
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  width: 45px;
  height: 45px;
  animation-delay: 0.15s;
  animation-direction: reverse;
}

.spinner-ring:nth-child(3) {
  width: 30px;
  height: 30px;
  animation-delay: 0.3s;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #fff;
  font-size: 14px;
  margin-top: 80px;
  animation: pulse 1.5s ease-in-out infinite;
}

.page-loading-enter-active,
.page-loading-leave-active {
  transition: opacity 0.5s ease;
}

.page-loading-enter-from,
.page-loading-leave-to {
  opacity: 0;
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 滑动过渡 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 缩放过渡 */
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.3s ease;
}

.zoom-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.zoom-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
