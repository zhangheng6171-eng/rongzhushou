import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '../api'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))
  const isLoggedIn = computed(() => !!token.value)
  
  // 会员信息
  const memberLevel = computed(() => userInfo.value?.memberLevel || 0)
  const memberLevelName = computed(() => {
    const levels = ['普通用户', '付费会员', '超级会员']
    return levels[memberLevel.value] || '普通用户'
  })
  const isMember = computed(() => memberLevel.value > 0)
  const isSuperMember = computed(() => memberLevel.value === 2)
  
  // AI积分
  const aiCredits = computed(() => userInfo.value?.aiCredits || 0)
  const hasCredits = computed(() => aiCredits.value > 0)
  
  // 登录
  async function login(data) {
    try {
      const res = await userApi.login(data)
      token.value = res.token
      userInfo.value = res.userInfo
      localStorage.setItem('token', res.token)
      localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
      return res
    } catch (error) {
      throw error
    }
  }
  
  // 注册
  async function register(data) {
    try {
      const res = await userApi.register(data)
      token.value = res.token
      userInfo.value = res.userInfo
      localStorage.setItem('token', res.token)
      localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
      return res
    } catch (error) {
      throw error
    }
  }
  
  // 获取用户信息
  async function fetchUserInfo() {
    if (!token.value) return null
    
    try {
      const res = await userApi.getInfo()
      userInfo.value = res
      localStorage.setItem('userInfo', JSON.stringify(res))
      return res
    } catch (error) {
      // Token过期，清除登录状态
      logout()
      throw error
    }
  }
  
  // 更新用户信息
  async function updateUserInfo(data) {
    try {
      const res = await userApi.updateInfo(data)
      userInfo.value = { ...userInfo.value, ...res }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return res
    } catch (error) {
      throw error
    }
  }
  
  // 退出登录
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
  
  // 消耗积分
  function consumeCredits(amount) {
    if (userInfo.value) {
      userInfo.value.aiCredits = Math.max(0, (userInfo.value.aiCredits || 0) - amount)
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }
  }
  
  // 添加积分
  function addCredits(amount) {
    if (userInfo.value) {
      userInfo.value.aiCredits = (userInfo.value.aiCredits || 0) + amount
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }
  }
  
  // 更新会员等级
  function updateMemberLevel(level) {
    if (userInfo.value) {
      userInfo.value.memberLevel = level
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }
  }
  
  // 检查是否可以访问会员内容
  function canAccessMemberContent() {
    return isMember.value
  }
  
  // 检查是否可以使用AI
  function canUseAI() {
    return isMember.value || hasCredits.value
  }
  
  // 获取剩余AI次数
  function getRemainingAIChances() {
    if (isMember.value) return '无限次'
    return aiCredits.value
  }
  
  return {
    // 状态
    token,
    userInfo,
    isLoggedIn,
    memberLevel,
    memberLevelName,
    isMember,
    isSuperMember,
    aiCredits,
    hasCredits,
    
    // 方法
    login,
    register,
    fetchUserInfo,
    updateUserInfo,
    logout,
    consumeCredits,
    addCredits,
    updateMemberLevel,
    canAccessMemberContent,
    canUseAI,
    getRemainingAIChances
  }
})
