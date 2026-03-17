import { ref, computed } from 'vue'
import {
  calculateEqualPayment,
  calculateEqualPrincipal,
  calculateInterestOnly,
  compareRepaymentMethods
} from '../utils/loan'

/**
 * 贷款计算Hook
 */
export function useLoanCalculator() {
  // 贷款参数
  const loanParams = ref({
    amount: 100, // 万元
    period: 12, // 月
    rate: 5.0, // 年利率
    method: 'equal-payment' // 还款方式
  })

  // 计算结果
  const result = ref(null)
  const schedule = ref([])
  const comparison = ref(null)
  const calculating = ref(false)

  // 方法名称映射
  const methodNames = {
    'equal-payment': '等额本息',
    'equal-principal': '等额本金',
    'interest-only': '先息后本'
  }

  // 当前方法名称
  const currentMethodName = computed(() => {
    return methodNames[loanParams.value.method]
  })

  // 计算贷款
  const calculate = async () => {
    calculating.value = true

    try {
      const principal = loanParams.value.amount * 10000 // 转换为元
      const rate = loanParams.value.rate
      const periods = loanParams.value.period

      let calcResult

      switch (loanParams.value.method) {
        case 'equal-payment':
          calcResult = calculateEqualPayment(principal, rate, periods)
          break
        case 'equal-principal':
          calcResult = calculateEqualPrincipal(principal, rate, periods)
          break
        case 'interest-only':
          calcResult = calculateInterestOnly(principal, rate, periods)
          break
        default:
          calcResult = calculateEqualPayment(principal, rate, periods)
      }

      result.value = calcResult
      schedule.value = calcResult.schedule

      // 计算对比
      comparison.value = compareRepaymentMethods(principal, rate, periods)

      return calcResult
    } catch (error) {
      console.error('Calculation error:', error)
      throw error
    } finally {
      calculating.value = false
    }
  }

  // 重置参数
  const reset = () => {
    loanParams.value = {
      amount: 100,
      period: 12,
      rate: 5.0,
      method: 'equal-payment'
    }
    result.value = null
    schedule.value = []
    comparison.value = null
  }

  // 更新参数
  const updateParams = (params) => {
    loanParams.value = { ...loanParams.value, ...params }
  }

  // 格式化金额
  const formatMoney = (value) => {
    return '¥' + Number(value).toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // 导出还款计划
  const exportSchedule = () => {
    if (!schedule.value.length) return

    const headers = ['期数', '月供金额', '本金', '利息', '剩余本金']
    const rows = schedule.value.map((item) => [
      item.period,
      item.payment.toFixed(2),
      item.principal.toFixed(2),
      item.interest.toFixed(2),
      item.balance.toFixed(2)
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], {
      type: 'text/csv;charset=utf-8;'
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `还款计划表_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // 保存计算记录
  const saveCalculation = () => {
    if (!result.value) return

    const record = {
      ...loanParams.value,
      result: {
        monthlyPayment: result.value.monthlyPayment,
        totalInterest: result.value.totalInterest,
        totalRepayment: result.value.totalRepayment
      },
      timestamp: new Date().toISOString()
    }

    const history = JSON.parse(localStorage.getItem('loanCalcHistory') || '[]')
    history.unshift(record)
    if (history.length > 20) history.pop()
    localStorage.setItem('loanCalcHistory', JSON.stringify(history))
  }

  // 获取计算历史
  const getCalculationHistory = () => {
    return JSON.parse(localStorage.getItem('loanCalcHistory') || '[]')
  }

  return {
    loanParams,
    result,
    schedule,
    comparison,
    calculating,
    currentMethodName,
    calculate,
    reset,
    updateParams,
    formatMoney,
    exportSchedule,
    saveCalculation,
    getCalculationHistory
  }
}

export default useLoanCalculator
