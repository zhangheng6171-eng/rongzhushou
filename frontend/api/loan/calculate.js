export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ code: 405, message: 'Method not allowed' })
  }

  try {
    const { amount, rate, months, method } = req.body

    // 验证参数
    if (!amount || !rate || !months || !method) {
      return res.status(400).json({
        code: 400,
        message: '参数不完整'
      })
    }

    const principal = parseFloat(amount)
    const monthRate = parseFloat(rate) / 100 / 12
    const n = parseInt(months)

    let result = {}

    switch (method) {
      case 'equal_payment':
        // 等额本息
        const monthlyPayment = (principal * monthRate * Math.pow(1 + monthRate, n)) / 
                              (Math.pow(1 + monthRate, n) - 1)
        const totalPayment = monthlyPayment * n
        
        // 生成还款计划
        const schedule1 = []
        let remainingPrincipal1 = principal
        for (let i = 1; i <= n; i++) {
          const interest = remainingPrincipal1 * monthRate
          const principalPaid = monthlyPayment - interest
          remainingPrincipal1 -= principalPaid
          schedule1.push({
            period: i,
            payment: monthlyPayment,
            principal: principalPaid,
            interest: interest,
            remainingPrincipal: Math.max(0, remainingPrincipal1)
          })
        }

        result = {
          method: 'equal_payment',
          methodName: '等额本息',
          monthlyPayment,
          totalPayment,
          totalInterest: totalPayment - principal,
          firstMonth: monthlyPayment,
          lastMonth: monthlyPayment,
          schedule: schedule1
        }
        break

      case 'equal_principal':
        // 等额本金
        const monthlyPrincipal = principal / n
        const firstMonthPayment = monthlyPrincipal + principal * monthRate
        const lastMonthPayment = monthlyPrincipal + monthlyPrincipal * monthRate
        
        // 生成还款计划
        const schedule2 = []
        let remainingPrincipal2 = principal
        let totalPayment2 = 0
        for (let i = 1; i <= n; i++) {
          const interest = remainingPrincipal2 * monthRate
          const payment = monthlyPrincipal + interest
          totalPayment2 += payment
          remainingPrincipal2 -= monthlyPrincipal
          schedule2.push({
            period: i,
            payment,
            principal: monthlyPrincipal,
            interest,
            remainingPrincipal: Math.max(0, remainingPrincipal2)
          })
        }

        result = {
          method: 'equal_principal',
          methodName: '等额本金',
          monthlyPayment: firstMonthPayment, // 首月还款
          totalPayment: totalPayment2,
          totalInterest: totalPayment2 - principal,
          firstMonth: firstMonthPayment,
          lastMonth: lastMonthPayment,
          schedule: schedule2
        }
        break

      case 'interest_only':
        // 先息后本
        const monthlyInterest = principal * monthRate
        const finalPayment = principal + monthlyInterest
        const totalPayment3 = monthlyInterest * n + principal

        // 生成还款计划
        const schedule3 = []
        for (let i = 1; i <= n; i++) {
          const isLastMonth = i === n
          const payment = isLastMonth ? finalPayment : monthlyInterest
          const principalPaid = isLastMonth ? principal : 0
          schedule3.push({
            period: i,
            payment,
            principal: principalPaid,
            interest: monthlyInterest,
            remainingPrincipal: isLastMonth ? 0 : principal
          })
        }

        result = {
          method: 'interest_only',
          methodName: '先息后本',
          monthlyPayment: monthlyInterest,
          totalPayment: totalPayment3,
          totalInterest: totalPayment3 - principal,
          firstMonth: monthlyInterest,
          lastMonth: finalPayment,
          finalPayment: principal,
          schedule: schedule3
        }
        break

      default:
        return res.status(400).json({
          code: 400,
          message: '不支持的还款方式'
        })
    }

    return res.status(200).json({
      code: 0,
      data: result
    })

  } catch (error) {
    console.error('Loan calculate error:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}
