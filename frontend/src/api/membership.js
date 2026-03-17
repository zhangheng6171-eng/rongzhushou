import request from './request'

/**
 * 会员相关API
 */
export const membershipApi = {
  // 获取会员套餐列表
  getPlans: () => request.get('/membership/plans'),

  // 获取会员状态
  getStatus: () => request.get('/membership/status'),

  // 订阅会员
  subscribe: (planId, paymentMethod) =>
    request.post('/membership/subscribe', { planId, paymentMethod }),

  // 取消订阅
  cancelSubscription: () => request.post('/membership/cancel'),

  // 续费会员
  renew: (planId) => request.post('/membership/renew', { planId }),

  // 升级会员
  upgrade: (planId) => request.post('/membership/upgrade', { planId }),

  // 获取会员权益
  getBenefits: () => request.get('/membership/benefits'),

  // 获取会员权益使用记录
  getBenefitHistory: (params) =>
    request.get('/membership/benefit-history', { params }),

  // 获取支付订单
  getPaymentOrders: (params) =>
    request.get('/membership/orders', { params }),

  // 获取订单详情
  getOrderDetail: (orderId) =>
    request.get(`/membership/orders/${orderId}`),

  // 创建支付订单
  createPaymentOrder: (planId) =>
    request.post('/membership/orders', { planId }),

  // 查询支付状态
  getPaymentStatus: (orderId) =>
    request.get(`/membership/orders/${orderId}/status`),

  // 发票申请
  applyInvoice: (orderId, invoiceInfo) =>
    request.post(`/membership/orders/${orderId}/invoice`, invoiceInfo),

  // 获取发票列表
  getInvoices: (params) =>
    request.get('/membership/invoices', { params }),

  // 获取会员卡信息
  getMemberCard: () => request.get('/membership/card'),

  // 领取会员权益
  claimBenefit: (benefitId) =>
    request.post(`/membership/benefits/${benefitId}/claim`),

  // 检查权益是否可用
  checkBenefit: (benefitType) =>
    request.get('/membership/benefits/check', { params: { benefitType } }),

  // 获取会员专属活动
  getMemberEvents: (params) =>
    request.get('/membership/events', { params }),

  // 参加活动
  joinEvent: (eventId) =>
    request.post(`/membership/events/${eventId}/join`),

  // 获取邀请记录
  getInvitations: (params) =>
    request.get('/membership/invitations', { params }),

  // 发送邀请
  sendInvitation: (phone, message) =>
    request.post('/membership/invite', { phone, message }),

  // 获取推荐奖励
  getReferralRewards: () =>
    request.get('/membership/referral-rewards')
}

export default membershipApi
