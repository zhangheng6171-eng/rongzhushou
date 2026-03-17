import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // ============ 状态定义 ============

  // 加载状态
  const globalLoading = ref(false)
  const loadingText = ref('')

  // 主题设置
  const theme = ref(localStorage.getItem('theme') || 'light')
  const primaryColor = ref(localStorage.getItem('primaryColor') || '#667eea')

  // 语言设置
  const language = ref(localStorage.getItem('language') || 'zh-CN')

  // 侧边栏状态
  const sidebarOpened = ref(
    localStorage.getItem('sidebarOpened') !== 'false'
  )

  // 缓存设置
  const cacheViews = ref(
    JSON.parse(localStorage.getItem('cacheViews')) || []
  )

  // 页面访问记录
  const visitedViews = ref(
    JSON.parse(localStorage.getItem('visitedViews')) || []
  )

  // 消息通知
  const notifications = ref([])
  const unreadCount = ref(0)

  // 模态框状态
  const modalState = ref({
    login: false,
    register: false,
    password: false
  })

  // ============ 计算属性 ============

  const isDark = computed(() => theme.value === 'dark')

  const currentLanguage = computed(() => {
    const langMap = {
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      'en-US': 'English'
    }
    return langMap[language.value] || '简体中文'
  })

  // ============ Actions ============

  // 设置加载状态
  const setLoading = (loading, text = '') => {
    globalLoading.value = loading
    loadingText.value = text
  }

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }

  // 应用主题
  const applyTheme = () => {
    const html = document.documentElement
    if (theme.value === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  // 设置主题色
  const setPrimaryColor = (color) => {
    primaryColor.value = color
    localStorage.setItem('primaryColor', color)
    document.documentElement.style.setProperty('--el-color-primary', color)
  }

  // 设置语言
  const setLanguage = (lang) => {
    language.value = lang
    localStorage.setItem('language', lang)
  }

  // 切换侧边栏
  const toggleSidebar = () => {
    sidebarOpened.value = !sidebarOpened.value
    localStorage.setItem('sidebarOpened', String(sidebarOpened.value))
  }

  // 添加缓存视图
  const addCacheView = (name) => {
    if (!cacheViews.value.includes(name)) {
      cacheViews.value.push(name)
      localStorage.setItem('cacheViews', JSON.stringify(cacheViews.value))
    }
  }

  // 移除缓存视图
  const removeCacheView = (name) => {
    const index = cacheViews.value.indexOf(name)
    if (index > -1) {
      cacheViews.value.splice(index, 1)
      localStorage.setItem('cacheViews', JSON.stringify(cacheViews.value))
    }
  }

  // 添加访问记录
  const addVisitedView = (view) => {
    const viewData = {
      name: view.name,
      path: view.path,
      title: view.meta?.title || view.name,
      query: view.query,
      params: view.params,
      time: Date.now()
    }

    // 避免重复添加
    const exists = visitedViews.value.some(
      (v) => v.path === viewData.path && v.name === viewData.name
    )

    if (!exists) {
      visitedViews.value.push(viewData)
      // 最多保留50条记录
      if (visitedViews.value.length > 50) {
        visitedViews.value.shift()
      }
      localStorage.setItem(
        'visitedViews',
        JSON.stringify(visitedViews.value)
      )
    }
  }

  // 清空访问记录
  const clearVisitedViews = () => {
    visitedViews.value = []
    localStorage.removeItem('visitedViews')
  }

  // 设置消息通知
  const setNotifications = (list) => {
    notifications.value = list
    unreadCount.value = list.filter((n) => !n.read).length
  }

  // 添加通知
  const addNotification = (notification) => {
    notifications.value.unshift(notification)
    if (!notification.read) {
      unreadCount.value++
    }
  }

  // 标记通知已读
  const markNotificationRead = (id) => {
    const notification = notifications.value.find((n) => n.id === id)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  }

  // 全部标记已读
  const markAllNotificationsRead = () => {
    notifications.value.forEach((n) => {
      n.read = true
    })
    unreadCount.value = 0
  }

  // 打开模态框
  const openModal = (modalName) => {
    modalState.value[modalName] = true
  }

  // 关闭模态框
  const closeModal = (modalName) => {
    modalState.value[modalName] = false
  }

  // 初始化应用设置
  const initAppSettings = () => {
    applyTheme()
  }

  return {
    // 状态
    globalLoading,
    loadingText,
    theme,
    primaryColor,
    language,
    sidebarOpened,
    cacheViews,
    visitedViews,
    notifications,
    unreadCount,
    modalState,

    // 计算属性
    isDark,
    currentLanguage,

    // Actions
    setLoading,
    toggleTheme,
    applyTheme,
    setPrimaryColor,
    setLanguage,
    toggleSidebar,
    addCacheView,
    removeCacheView,
    addVisitedView,
    clearVisitedViews,
    setNotifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    openModal,
    closeModal,
    initAppSettings
  }
})
