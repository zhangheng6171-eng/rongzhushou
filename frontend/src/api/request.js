import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '../router'
import { useUserStore } from '../stores/user'

// 创建axios实例
const request = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Token刷新相关
let isRefreshing = false
let refreshSubscribers = []

// 订阅Token刷新
const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb)
}

// 通知所有订阅者
const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

// 刷新Token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  try {
    const response = await axios.post('/api/auth/refresh', {
      refreshToken
    })
    const { token, refreshToken: newRefreshToken } = response.data.data
    localStorage.setItem('token', token)
    localStorage.setItem('refreshToken', newRefreshToken)
    return token
  } catch (error) {
    // 刷新失败，清除登录状态
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    router.push('/login')
    throw error
  }
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 添加请求ID用于追踪
    config.headers['X-Request-ID'] = generateRequestId()

    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }

    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response

    // 如果返回的是文件流，直接返回
    if (response.config.responseType === 'blob') {
      return response
    }

    // 业务状态码判断
    if (data.code === 0 || data.code === 200) {
      return data.data
    }

    // 业务错误
    const errorMsg = data.message || '请求失败'
    ElMessage.error(errorMsg)
    return Promise.reject(new Error(errorMsg))
  },
  async (error) => {
    const { response, config } = error

    if (!response) {
      // 网络错误或请求被取消
      if (error.message.includes('timeout')) {
        ElMessage.error('请求超时，请稍后重试')
      } else if (error.message.includes('Network Error')) {
        ElMessage.error('网络连接失败，请检查网络')
      } else if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message)
      } else {
        ElMessage.error('请求失败，请稍后重试')
      }
      return Promise.reject(error)
    }

    const { status, data } = response
    const errorMsg = data?.message || '请求失败'

    switch (status) {
      case 400:
        ElMessage.error(errorMsg || '请求参数错误')
        break

      case 401:
        // Token过期，尝试刷新
        if (!isRefreshing) {
          isRefreshing = true
          try {
            const newToken = await refreshToken()
            isRefreshing = false
            onRefreshed(newToken)
            // 重试原请求
            config.headers.Authorization = `Bearer ${newToken}`
            return request(config)
          } catch (refreshError) {
            isRefreshing = false
            ElMessage.error('登录已过期，请重新登录')
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('userInfo')
            router.push('/login')
            return Promise.reject(refreshError)
          }
        } else {
          // 正在刷新，将请求加入队列
          return new Promise((resolve) => {
            subscribeTokenRefresh((token) => {
              config.headers.Authorization = `Bearer ${token}`
              resolve(request(config))
            })
          })
        }

      case 403:
        ElMessage.error('没有权限访问该资源')
        break

      case 404:
        ElMessage.error('请求的资源不存在')
        break

      case 429:
        ElMessage.error('请求过于频繁，请稍后重试')
        break

      case 500:
        ElMessage.error('服务器内部错误，请稍后重试')
        break

      case 502:
      case 503:
      case 504:
        ElMessage.error('服务暂时不可用，请稍后重试')
        break

      default:
        ElMessage.error(errorMsg)
    }

    return Promise.reject(error)
  }
)

// 生成请求ID
const generateRequestId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default request
