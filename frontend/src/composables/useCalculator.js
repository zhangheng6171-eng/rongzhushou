/**
 * 贷款计算器工具函数
 * 支持等额本息、等额本金、先息后本三种还款方式
 */

/**
 * 等额本息计算
 * 每月还款金额 = [贷款本金×月利率×(1+月利率)^还款月数] ÷ [(1+月利率)^还款月数-1]
 */
export function calculateEqualPayment(principal, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12
  
  if (monthlyRate === 0) {
    return {
      monthlyPayment: principal / months,
      totalPayment: principal,
      totalInterest: 0,
      schedule: generateEqualPaymentSchedule(principal, 0, months)
    }
  }
  
  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                         (Math.pow(1 + monthlyRate, months) - 1)
  const totalPayment = monthlyPayment * months
  const totalInterest = totalPayment - principal
  
  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    schedule: generateEqualPaymentSchedule(principal, monthlyRate, months, monthlyPayment)
  }
}

/**
 * 等额本金计算
 * 每月还款金额 = (贷款本金÷还款月数) + (贷款本金-已归还本金累计额)×月利率
 */
export function calculateEqualPrincipal(principal, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12
  const monthlyPrincipal = principal / months
  let totalInterest = 0
  const schedule = []
  
  for (let i = 1; i <= months; i++) {
    const remainingPrincipal = principal - monthlyPrincipal * (i - 1)
    const interest = remainingPrincipal * monthlyRate
    const payment = monthlyPrincipal + interest
    totalInterest += interest
    
    schedule.push({
      period: i,
      payment: Math.round(payment * 100) / 100,
      principal: Math.round(monthlyPrincipal * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      remainingPrincipal: Math.round((remainingPrincipal - monthlyPrincipal) * 100) / 100
    })
  }
  
  return {
    firstMonthPayment: schedule[0].payment,
    lastMonthPayment: schedule[schedule.length - 1].payment,
    totalPayment: Math.round((principal + totalInterest) * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    schedule
  }
}

/**
 * 先息后本计算
 * 每月只还利息，最后一期还本金+利息
 */
export function calculateInterestOnly(principal, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12
  const monthlyInterest = principal * monthlyRate
  const schedule = []
  
  for (let i = 1; i <= months; i++) {
    const isLast = i === months
    const payment = isLast ? principal + monthlyInterest : monthlyInterest
    const principalPayment = isLast ? principal : 0
    const remainingPrincipal = isLast ? 0 : principal
    
    schedule.push({
      period: i,
      payment: Math.round(payment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(monthlyInterest * 100) / 100,
      remainingPrincipal
    })
  }
  
  const totalInterest = monthlyInterest * months
  
  return {
    monthlyInterest: Math.round(monthlyInterest * 100) / 100,
    finalPayment: Math.round((principal + monthlyInterest) * 100) / 100,
    totalPayment: Math.round((principal + totalInterest) * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    schedule
  }
}

/**
 * 生成等额本息还款计划表
 */
function generateEqualPaymentSchedule(principal, monthlyRate, months, monthlyPayment) {
  const schedule = []
  let remainingPrincipal = principal
  
  for (let i = 1; i <= months; i++) {
    const interest = remainingPrincipal * monthlyRate
    const principalPayment = monthlyPayment - interest
    remainingPrincipal -= principalPayment
    
    schedule.push({
      period: i,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      remainingPrincipal: Math.round(remainingPrincipal * 100) / 100
    })
  }
  
  return schedule
}

/**
 * 计算贷款利率区间对应的月供区间
 */
export function calculatePaymentRange(principal, minRate, maxRate, months) {
  const minResult = calculateEqualPayment(principal, minRate, months)
  const maxResult = calculateEqualPayment(principal, maxRate, months)
  
  return {
    minPayment: minResult.monthlyPayment,
    maxPayment: maxResult.monthlyPayment,
    avgPayment: (minResult.monthlyPayment + maxResult.monthlyPayment) / 2
  }
}

/**
 * 根据月供反推贷款金额
 */
export function calculatePrincipalFromPayment(monthlyPayment, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12
  
  if (monthlyRate === 0) {
    return monthlyPayment * months
  }
  
  const principal = monthlyPayment * (Math.pow(1 + monthlyRate, months) - 1) / 
                    (monthlyRate * Math.pow(1 + monthlyRate, months))
  
  return Math.round(principal * 100) / 100
}

/**
 * 计算提前还款节省的利息
 */
export function calculateEarlyPayment(principal, annualRate, months, currentPeriod, earlyPaymentAmount) {
  const result = calculateEqualPayment(principal, annualRate, months)
  const remainingSchedule = result.schedule.slice(currentPeriod)
  
  // 计算剩余利息
  const remainingInterest = remainingSchedule.reduce((sum, item) => sum + item.interest, 0)
  
  // 计算提前还款后节省的利息比例
  const savedRatio = earlyPaymentAmount / result.schedule[currentPeriod].remainingPrincipal
  const savedInterest = remainingInterest * savedRatio
  
  return {
    originalTotalInterest: result.totalInterest,
    savedInterest: Math.round(savedInterest * 100) / 100,
    newTotalInterest: Math.round((result.totalInterest - savedInterest) * 100) / 100
  }
}

/**
 * 格式化金额显示
 */
export function formatCurrency(amount) {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(2) + '万'
  }
  return amount.toFixed(2) + '元'
}

/**
 * 格式化百分比显示
 */
export function formatPercent(rate) {
  return rate.toFixed(2) + '%'
}

/**
 * 获取还款方式说明
 */
export const paymentMethodDesc = {
  equal_payment: {
    name: '等额本息',
    desc: '每月还款金额相同，适合收入稳定的人群',
    advantage: '每月还款压力均衡，便于规划',
    disadvantage: '总利息相对较高'
  },
  equal_principal: {
    name: '等额本金',
    desc: '每月偿还相同本金，利息逐月递减',
    advantage: '总利息较低，越还越轻松',
    disadvantage: '前期还款压力较大'
  },
  interest_only: {
    name: '先息后本',
    desc: '每月只还利息，到期还本金',
    advantage: '前期还款压力最小',
    disadvantage: '最后一期压力大，总利息最高'
  }
}

/**
 * 贷款产品类型
 */
export const loanTypes = [
  {
    id: 'credit',
    name: '信用贷款',
    maxAmount: 1000000,
    minRate: 3.5,
    maxRate: 8,
    maxTerm: 36,
    features: ['无需抵押', '审批快速', '额度灵活']
  },
  {
    id: 'mortgage',
    name: '抵押贷款',
    maxAmount: 10000000,
    minRate: 3.2,
    maxRate: 6,
    maxTerm: 120,
    features: ['利率低', '额度高', '期限长']
  },
  {
    id: 'policy',
    name: '政策性贷款',
    maxAmount: 3000000,
    minRate: 2.5,
    maxRate: 4.5,
    maxTerm: 60,
    features: ['利率优惠', '政府贴息', '专项支持']
  },
  {
    id: 'guarantee',
    name: '担保贷款',
    maxAmount: 5000000,
    minRate: 4,
    maxRate: 7,
    maxTerm: 48,
    features: ['第三方担保', '额度适中', '审批便捷']
  }
]

export default {
  calculateEqualPayment,
  calculateEqualPrincipal,
  calculateInterestOnly,
  calculatePaymentRange,
  calculatePrincipalFromPayment,
  calculateEarlyPayment,
  formatCurrency,
  formatPercent,
  paymentMethodDesc,
  loanTypes
}
