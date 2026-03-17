import axios from 'axios'
import { ElMessage } from 'element-plus'

// API基础配置
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.rongzhi.com'
const TIMEOUT = 30000

// 创建axios实例
const request = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加Token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加设备信息
    config.headers['X-Device-Type'] = 'web'
    config.headers['X-App-Version'] = '1.0.0'
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 统一响应格式处理
    if (data.code === 0) {
      return data.data
    }
    
    // 业务错误
    ElMessage.error(data.message || '请求失败')
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error) => {
    // HTTP错误处理
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // Token过期，清除登录状态
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          window.location.href = '/login'
          ElMessage.error('登录已过期，请重新登录')
          break
        case 403:
          ElMessage.error('没有权限访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器错误，请稍后重试')
          break
        default:
          ElMessage.error(data?.message || '请求失败')
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接')
    } else {
      ElMessage.error(error.message || '请求失败')
    }
    
    return Promise.reject(error)
  }
)

// ============ 用户相关API ============

export const userApi = {
  // 发送验证码
  sendCode(phone) {
    return request.post('/user/send-code', { phone })
  },
  
  // 登录
  login(data) {
    return request.post('/user/login', data)
  },
  
  // 注册
  register(data) {
    return request.post('/user/register', data)
  },
  
  // 获取用户信息
  getInfo() {
    return request.get('/user/info')
  },
  
  // 更新用户信息
  updateInfo(data) {
    return request.put('/user/info', data)
  },
  
  // 修改密码
  changePassword(data) {
    return request.post('/user/change-password', data)
  },
  
  // 退出登录
  logout() {
    return request.post('/user/logout')
  }
}

// ============ AI对话相关API ============

export const aiApi = {
  // 发送消息
  chat(message, conversationId) {
    return request.post('/ai/chat', { message, conversationId })
  },
  
  // 获取对话历史
  getHistory(params) {
    return request.get('/ai/history', { params })
  },
  
  // 获取对话详情
  getConversation(id) {
    return request.get(`/ai/conversation/${id}`)
  },
  
  // 删除对话
  deleteConversation(id) {
    return request.delete(`/ai/conversation/${id}`)
  },
  
  // 获取快捷问题
  getQuickQuestions() {
    return request.get('/ai/quick-questions')
  }
}

// ============ 文章相关API ============

export const articleApi = {
  // 获取文章列表
  getList(params) {
    return request.get('/article/list', { params })
  },
  
  // 获取文章详情
  getDetail(id) {
    return request.get(`/article/${id}`)
  },
  
  // 获取分类列表
  getCategories() {
    return request.get('/article/categories')
  },
  
  // 搜索文章
  search(keyword) {
    return request.get('/article/search', { params: { keyword } })
  },
  
  // 获取热门文章
  getHot() {
    return request.get('/article/hot')
  },
  
  // 获取推荐文章
  getRecommend(id) {
    return request.get(`/article/${id}/recommend`)
  },
  
  // 收藏文章
  favorite(id) {
    return request.post(`/article/${id}/favorite`)
  },
  
  // 取消收藏
  unfavorite(id) {
    return request.delete(`/article/${id}/favorite`)
  },
  
  // 点赞文章
  like(id) {
    return request.post(`/article/${id}/like`)
  }
}

// ============ 贷款相关API ============

export const loanApi = {
  // 计算贷款
  calculate(data) {
    return request.post('/loan/calculate', data)
  },
  
  // 获取贷款产品列表
  getProducts(params) {
    return request.get('/loan/products', { params })
  },
  
  // 获取产品详情
  getProductDetail(id) {
    return request.get(`/loan/products/${id}`)
  },
  
  // 获取推荐产品
  getRecommendProducts(data) {
    return request.post('/loan/recommend', data)
  },
  
  // 申请贷款
  apply(data) {
    return request.post('/loan/apply', data)
  },
  
  // 获取申请进度
  getApplyProgress(id) {
    return request.get(`/loan/apply/${id}/progress`)
  }
}

// ============ 会员相关API ============

export const memberApi = {
  // 获取会员套餐
  getPackages() {
    return request.get('/member/packages')
  },
  
  // 获取会员状态
  getStatus() {
    return request.get('/member/status')
  },
  
  // 订阅会员
  subscribe(packageId) {
    return request.post('/member/subscribe', { packageId })
  },
  
  // 获取订单列表
  getOrders(params) {
    return request.get('/member/orders', { params })
  },
  
  // 获取订单详情
  getOrderDetail(id) {
    return request.get(`/member/orders/${id}`)
  },
  
  // 取消订阅
  unsubscribe() {
    return request.post('/member/unsubscribe')
  }
}

// ============ 支付相关API ============

export const paymentApi = {
  // 创建支付
  createPayment(data) {
    return request.post('/payment/create', data)
  },
  
  // 查询支付状态
  getPaymentStatus(id) {
    return request.get(`/payment/${id}/status`)
  },
  
  // 支付回调（微信）
  wechatCallback(data) {
    return request.post('/payment/wechat/callback', data)
  }
}

// ============ 通用API ============

export const commonApi = {
  // 获取系统配置
  getConfig() {
    return request.get('/common/config')
  },
  
  // 上传文件
  uploadFile(file, type = 'image') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    return request.post('/common/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  
  // 发送反馈
  sendFeedback(data) {
    return request.post('/common/feedback', data)
  },
  
  // 获取统计数据
  getStatistics() {
    return request.get('/common/statistics')
  }
}

export default {
  user: userApi,
  ai: aiApi,
  article: articleApi,
  loan: loanApi,
  member: memberApi,
  payment: paymentApi,
  common: commonApi
}
