<template>
  <teleport to="body">
    <transition name="toast">
      <div v-if="visible" :class="['toast-container', type]">
        <div class="toast-icon">
          <span v-if="type === 'success'">✓</span>
          <span v-else-if="type === 'error'">✕</span>
          <span v-else-if="type === 'warning'">!</span>
          <span v-else>ℹ</span>
        </div>
        <div class="toast-content">
          <p class="toast-title" v-if="title">{{ title }}</p>
          <p class="toast-message">{{ message }}</p>
        </div>
        <button class="toast-close" @click="close">×</button>
        <div class="toast-progress"></div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info' // success, error, warning, info
  },
  title: String,
  message: String,
  duration: {
    type: Number,
    default: 3000
  }
})

const visible = ref(false)
const emit = defineEmits(['close'])

const show = () => {
  visible.value = true
  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }
}

const close = () => {
  visible.value = false
  emit('close')
}

onMounted(() => {
  show()
})

defineExpose({ show, close })
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 400px;
  padding: 16px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  z-index: 10000;
  overflow: hidden;
}

.toast-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: bold;
  font-size: 14px;
}

.toast-container.success .toast-icon {
  background: #e8f5e9;
  color: #4caf50;
}

.toast-container.error .toast-icon {
  background: #ffebee;
  color: #f44336;
}

.toast-container.warning .toast-icon {
  background: #fff3e0;
  color: #ff9800;
}

.toast-container.info .toast-icon {
  background: #e3f2fd;
  color: #2196f3;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.toast-message {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.toast-close {
  background: none;
  border: none;
  font-size: 20px;
  color: #999;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.toast-close:hover {
  color: #333;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.5;
  animation: progress linear forwards;
}

.toast-container.success .toast-progress {
  background: #4caf50;
}

.toast-container.error .toast-progress {
  background: #f44336;
}

.toast-container.warning .toast-progress {
  background: #ff9800;
}

.toast-container.info .toast-progress {
  background: #2196f3;
}

@keyframes progress {
  from { width: 100%; }
  to { width: 0%; }
}

.toast-enter-active {
  animation: slideInRight 0.3s ease;
}

.toast-leave-active {
  animation: slideOutRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
