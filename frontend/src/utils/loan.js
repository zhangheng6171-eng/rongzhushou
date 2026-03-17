/**
 * 贷款计算工具
 */

/**
 * 等额本息计算
 * @param {number} principal 本金（元）
 * @param {number} annualRate 年利率（如 5.5 表示 5.5%）
 * @param {number} periods 还款期数（月）
 * @returns {Object} 计算结果
 */
export const calculateEqualPayment = (principal, annualRate, periods) => {
  const monthlyRate = annualRate / 100 / 12

  // 月供金额 = [本金 × 月利率 × (1+月利率)^还款月数] ÷ [(1+月利率)^还款月数 - 1]
  const monthlyPayment =
    principal * monthlyRate * Math.pow(1 + monthlyRate, periods) /
    (Math.pow(1 + monthlyRate, periods) - 1)

  const totalRepayment = monthlyPayment * periods
  const totalInterest = totalRepayment - principal

  // 生成还款计划表
  const schedule = []
  let remainingPrincipal = principal

  for (let i = 1; i <= periods; i++) {
    const interest = remainingPrincipal * monthlyRate
    const payPrincipal = monthlyPayment - interest
    remainingPrincipal -= payPrincipal

    schedule.push({
      period: i,
      payment: monthlyPayment,
      principal: payPrincipal,
      interest: interest,
      balance: Math.max(0, remainingPrincipal),
      // 累计还款
      accumulatedPayment: monthlyPayment * i,
      // 累计利息
      accumulatedInterest: interest + (schedule[i - 2]?.accumulatedInterest || 0)
    })
  }

  return {
    monthlyPayment,
    totalRepayment,
    totalInterest,
    principal,
    periods,
    annualRate,
    schedule,
    method: 'equal-payment',
    methodName: '等额本息'
  }
}

/**
 * 等额本金计算
 * @param {number} principal 本金（元）
 * @param {number} annualRate 年利率（如 5.5 表示 5.5%）
 * @param {number} periods 还款期数（月）
 * @returns {Object} 计算结果
 */
export const calculateEqualPrincipal = (principal, annualRate, periods) => {
  const monthlyRate = annualRate / 100 / 12
  const monthlyPrincipal = principal / periods

  let totalInterest = 0
  const schedule = []
  let remainingPrincipal = principal

  for (let i = 1; i <= periods; i++) {
    const interest = remainingPrincipal * monthlyRate
    const payment = monthlyPrincipal + interest
    totalInterest += interest
    remainingPrincipal -= monthlyPrincipal

    schedule.push({
      period: i,
      payment: payment,
      principal: monthlyPrincipal,
      interest: interest,
      balance: Math.max(0, remainingPrincipal),
      accumulatedPayment: monthlyPrincipal * i + totalInterest,
      accumulatedInterest: totalInterest
    })
  }

  const totalRepayment = principal + totalInterest

  return {
    monthlyPayment: schedule[0].payment, // 首月还款（最高）
    minPayment: schedule[schedule.length - 1].payment, // 末月还款（最低）
    totalRepayment,
    totalInterest,
    principal,
    periods,
    annualRate,
    schedule,
    method: 'equal-principal',
    methodName: '等额本金'
  }
}

/**
 * 先息后本计算
 * @param {number} principal 本金（元）
 * @param {number} annualRate 年利率（如 5.5 表示 5.5%）
 * @param {number} periods 还款期数（月）
 * @returns {Object} 计算结果
 */
export const calculateInterestOnly = (principal, annualRate, periods) => {
  const monthlyRate = annualRate / 100 / 12
  const monthlyInterest = principal * monthlyRate

  const schedule = []
  let totalInterest = 0

  for (let i = 1; i <= periods; i++) {
    const isLast = i === periods
    const payment = isLast ? monthlyInterest + principal : monthlyInterest
    totalInterest += monthlyInterest

    schedule.push({
      period: i,
      payment: payment,
      principal: isLast ? principal : 0,
      interest: monthlyInterest,
      balance: isLast ? 0 : principal,
      accumulatedPayment: monthlyInterest * i + (isLast ? principal : 0),
      accumulatedInterest: totalInterest
    })
  }

  const totalRepayment = principal + totalInterest

  return {
    monthlyPayment: monthlyInterest,
    lastPayment: monthlyInterest + principal,
    totalRepayment,
    totalInterest,
    principal,
    periods,
    annualRate,
    schedule,
    method: 'interest-only',
    methodName: '先息后本'
  }
}

/**
 * 对比不同还款方式
 * @param {number} principal 本金
 * @param {number} annualRate 年利率
 * @param {number} periods 还款期数
 * @returns {Object} 对比结果
 */
export const compareRepaymentMethods = (principal, annualRate, periods) => {
  const equalPayment = calculateEqualPayment(principal, annualRate, periods)
  const equalPrincipal = calculateEqualPrincipal(principal, annualRate, periods)
  const interestOnly = calculateInterestOnly(principal, annualRate, periods)

  return {
    equalPayment: {
      monthlyPayment: equalPayment.monthlyPayment,
      totalInterest: equalPayment.totalInterest,
      totalRepayment: equalPayment.totalRepayment
    },
    equalPrincipal: {
      maxPayment: equalPrincipal.monthlyPayment,
      minPayment: equalPrincipal.minPayment,
      totalInterest: equalPrincipal.totalInterest,
      totalRepayment: equalPrincipal.totalRepayment
    },
    interestOnly: {
      monthlyPayment: interestOnly.monthlyPayment,
      lastPayment: interestOnly.lastPayment,
      totalInterest: interestOnly.totalInterest,
      totalRepayment: interestOnly.totalRepayment
    },
    // 利息差异
    interestDifference: {
      equalPaymentVsPrincipal: equalPayment.totalInterest - equalPrincipal.totalInterest,
      equalPaymentVsInterestOnly: equalPayment.totalInterest - interestOnly.totalInterest,
      principalVsInterestOnly: equalPrincipal.totalInterest - interestOnly.totalInterest
    },
    // 推荐方案
    recommendation: getRecommendation(equalPayment, equalPrincipal, interestOnly)
  }
}

/**
 * 获取还款方式推荐
 */
const getRecommendation = (equalPayment, equalPrincipal, interestOnly) => {
  const recommendations = []

  // 利息最低
  const interestRank = [
    { method: 'equal-principal', interest: equalPrincipal.totalInterest, name: '等额本金' },
    { method: 'equal-payment', interest: equalPayment.totalInterest, name: '等额本息' },
    { method: 'interest-only', interest: interestOnly.totalInterest, name: '先息后本' }
  ].sort((a, b) => a.interest - b.interest)

  recommendations.push({
    type: 'interest',
    best: interestRank[0],
    reason: `${interestRank[0].name}利息最少，比其他方式节省${formatMoney(interestRank[2].interest - interestRank[0].interest)}`
  })

  // 月供最低
  const paymentRank = [
    { method: 'interest-only', payment: interestOnly.monthlyPayment, name: '先息后本' },
    { method: 'equal-payment', payment: equalPayment.monthlyPayment, name: '等额本息' },
    { method: 'equal-principal', payment: equalPrincipal.monthlyPayment, name: '等额本金' }
  ].sort((a, b) => a.payment - b.payment)

  recommendations.push({
    type: 'payment',
    best: paymentRank[0],
    reason: `${paymentRank[0].name}月供最低（${formatMoney(paymentRank[0].payment)}），还款压力小`
  })

  return recommendations
}

/**
 * 格式化金额
 */
const formatMoney = (value) => {
  return '¥' + Number(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * 计算实际年化利率（IRR）
 * @param {Array} cashFlows 现金流数组（第一期为负数表示放款金额，后面为每期还款）
 * @returns {number} 实际年化利率
 */
export const calculateIRR = (cashFlows, guess = 0.1) => {
  const maxIterations = 100
  const tolerance = 1e-6

  let rate = guess

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0
    let dnpv = 0

    for (let j = 0; j < cashFlows.length; j++) {
      const pv = cashFlows[j] / Math.pow(1 + rate, j)
      npv += pv
      dnpv -= j * pv / (1 + rate)
    }

    const newRate = rate - npv / dnpv

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 12 // 转换为年化
    }

    rate = newRate
  }

  return rate * 12
}

/**
 * 计算提前还款节省
 * @param {Object} originalResult 原贷款计算结果
 * @param {number} prepaymentAmount 提前还款金额
 * @param {number} prepaymentPeriod 提前还款期数
 * @returns {Object} 节省结果
 */
export const calculatePrepaymentSaving = (
  originalResult,
  prepaymentAmount,
  prepaymentPeriod
) => {
  const { principal, annualRate, periods, method } = originalResult
  const remainingPrincipal = originalResult.schedule[prepaymentPeriod - 1]?.balance || 0
  const newPrincipal = remainingPrincipal - prepaymentAmount
  const remainingPeriods = periods - prepaymentPeriod

  if (newPrincipal <= 0 || remainingPeriods <= 0) {
    return {
      savedInterest: originalResult.totalInterest -
        originalResult.schedule[prepaymentPeriod - 1]?.accumulatedInterest,
      message: '全额还清'
    }
  }

  // 计算剩余贷款
  let newResult
  switch (method) {
    case 'equal-payment':
      newResult = calculateEqualPayment(newPrincipal, annualRate, remainingPeriods)
      break
    case 'equal-principal':
      newResult = calculateEqualPrincipal(newPrincipal, annualRate, remainingPeriods)
      break
    case 'interest-only':
      newResult = calculateInterestOnly(newPrincipal, annualRate, remainingPeriods)
      break
  }

  const originalRemainingInterest =
    originalResult.totalInterest -
    originalResult.schedule[prepaymentPeriod - 1]?.accumulatedInterest

  const savedInterest = originalRemainingInterest - newResult.totalInterest

  return {
    savedInterest,
    newMonthlyPayment: newResult.monthlyPayment,
    newTotalInterest: newResult.totalInterest,
    message: `提前还款${formatMoney(prepaymentAmount)}可节省利息${formatMoney(savedInterest)}`
  }
}

export default {
  calculateEqualPayment,
  calculateEqualPrincipal,
  calculateInterestOnly,
  compareRepaymentMethods,
  calculateIRR,
  calculatePrepaymentSaving
}
