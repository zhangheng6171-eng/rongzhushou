import request from './request'

/**
 * 贷款计算器相关API
 */
export const loanApi = {
  // 计算贷款
  calculate: (data) => request.post('/loan/calculate', data),

  // 等额本息计算
  calculateEqualPayment: (principal, rate, periods) =>
    request.post('/loan/calculate/equal-payment', {
      principal,
      rate,
      periods
    }),

  // 等额本金计算
  calculateEqualPrincipal: (principal, rate, periods) =>
    request.post('/loan/calculate/equal-principal', {
      principal,
      rate,
      periods
    }),

  // 先息后本计算
  calculateInterestOnly: (principal, rate, periods) =>
    request.post('/loan/calculate/interest-only', {
      principal,
      rate,
      periods
    }),

  // 获取还款计划表
  getRepaymentSchedule: (data) =>
    request.post('/loan/schedule', data),

  // 对比不同还款方式
  compareMethods: (principal, rate, periods) =>
    request.post('/loan/compare', { principal, rate, periods }),

  // 获取贷款产品列表
  getProducts: (params) => request.get('/loan/products', { params }),

  // 获取贷款产品详情
  getProductDetail: (id) => request.get(`/loan/products/${id}`),

  // 获取推荐产品
  getRecommendedProducts: (params) =>
    request.get('/loan/products/recommended', { params }),

  // 申请贷款
  applyLoan: (data) => request.post('/loan/apply', data),

  // 获取申请进度
  getApplicationStatus: (applicationId) =>
    request.get(`/loan/application/${applicationId}`),

  // 获取我的贷款申请列表
  getMyApplications: (params) =>
    request.get('/loan/my-applications', { params }),

  // 保存计算记录
  saveCalculation: (data) => request.post('/loan/calculation/save', data),

  // 获取计算记录
  getCalculationHistory: (params) =>
    request.get('/loan/calculation/history', { params }),

  // 导出还款计划
  exportSchedule: (data, format = 'xlsx') =>
    request.post('/loan/schedule/export', data, {
      params: { format },
      responseType: 'blob'
    }),

  // 获取利率趋势
  getRateTrend: (loanType, months = 12) =>
    request.get('/loan/rate-trend', { params: { loanType, months } }),

  // 利率预测
  predictRate: (params) => request.post('/loan/rate-predict', params)
}

export default loanApi
