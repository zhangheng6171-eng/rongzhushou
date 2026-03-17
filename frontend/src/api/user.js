import request from './request'

/**
 * 用户认证相关API
 */
export const authApi = {
  // 登录
  login: (data) => request.post('/auth/login', data),

  // 注册
  register: (data) => request.post('/auth/register', data),

  // 发送短信验证码
  sendSms: (phone) => request.post('/auth/sms', { phone }),

  // 发送邮箱验证码
  sendEmailCode: (email, type = 'register') =>
    request.post('/auth/email/code', { email, type }),

  // 验证码登录
  loginByCode: (phone, code) =>
    request.post('/auth/login/code', { phone, code }),

  // 重置密码
  resetPassword: (data) => request.post('/auth/reset-password', data),

  // 刷新Token
  refreshToken: (refreshToken) =>
    request.post('/auth/refresh', { refreshToken }),

  // 退出登录
  logout: () => request.post('/auth/logout')
}

/**
 * 用户信息相关API
 */
export const userApi = {
  // 获取用户信息
  getUserInfo: () => request.get('/user/info'),

  // 更新用户信息
  updateUserInfo: (data) => request.put('/user/info', data),

  // 修改密码
  changePassword: (data) => request.put('/user/password', data),

  // 上传头像
  uploadAvatar: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  // 实名认证
  verifyIdentity: (data) => request.post('/user/verify', data),

  // 获取实名认证状态
  getVerifyStatus: () => request.get('/user/verify/status'),

  // 绑定手机号
  bindPhone: (phone, code) =>
    request.post('/user/bind-phone', { phone, code }),

  // 绑定邮箱
  bindEmail: (email, code) =>
    request.post('/user/bind-email', { email, code }),

  // 获取积分记录
  getPointsHistory: (params) => request.get('/user/points', { params }),

  // 获取积分余额
  getPointsBalance: () => request.get('/user/points/balance'),

  // 消耗积分
  consumePoints: (amount, reason) =>
    request.post('/user/points/consume', { amount, reason }),

  // 获取消息通知
  getNotifications: (params) => request.get('/user/notifications', { params }),

  // 标记消息已读
  markNotificationRead: (id) =>
    request.put(`/user/notifications/${id}/read`),

  // 全部标记已读
  markAllNotificationsRead: () =>
    request.put('/user/notifications/read-all'),

  // 获取未读消息数量
  getUnreadCount: () => request.get('/user/notifications/unread-count')
}

export default {
  ...authApi,
  ...userApi
}
