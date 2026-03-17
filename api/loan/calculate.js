export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ code: 405, message: 'Method not allowed' })

  try {
    const { amount, rate, months, method } = req.body

    if (!amount || !rate || !months || !method) {
      return res.status(400).json({ code: 400, message: '参数不完整' })
    }

    const principal = parseFloat(amount)
    const monthRate = parseFloat(rate) / 100 / 12
    const n = parseInt(months)

    let result = {}

    switch (method) {
      case 'equal_payment': {
        const monthlyPayment = (principal * monthRate * Math.pow(1 + monthRate, n)) / 
                              (Math.pow(1 + monthRate, n) - 1)
        const totalPayment = monthlyPayment * n
        
        const schedule = []
        let remaining = principal
        for (let i = 1; i <= n; i++) {
          const interest = remaining * monthRate
          const principalPaid = monthlyPayment - interest
          remaining -= principalPaid
          schedule.push({
            period: i,
            payment: monthlyPayment,
            principal: principalPaid,
            interest,
            remainingPrincipal: Math.max(0, remaining)
          })
        }

        result = {
          method: 'equal_payment',
          methodName: '等额本息',
          monthlyPayment,
          totalPayment,
          totalInterest: totalPayment - principal,
          schedule
        }
        break
      }

      case 'equal_principal': {
        const monthlyPrincipal = principal / n
        let totalPayment = 0
        const schedule = []
        let remaining = principal

        for (let i = 1; i <= n; i++) {
          const interest = remaining * monthRate
          const payment = monthlyPrincipal + interest
          totalPayment += payment
          remaining -= monthlyPrincipal
          schedule.push({
            period: i,
            payment,
            principal: monthlyPrincipal,
            interest,
            remainingPrincipal: Math.max(0, remaining)
          })
        }

        result = {
          method: 'equal_principal',
          methodName: '等额本金',
          monthlyPayment: schedule[0].payment,
          totalPayment,
          totalInterest: totalPayment - principal,
          firstMonth: schedule[0].payment,
          lastMonth: schedule[n - 1].payment,
          schedule
        }
        break
      }

      case 'interest_only': {
        const monthlyInterest = principal * monthRate
        const finalPayment = principal + monthlyInterest
        const totalPayment = monthlyInterest * n + principal

        const schedule = []
        for (let i = 1; i <= n; i++) {
          const isLast = i === n
          schedule.push({
            period: i,
            payment: isLast ? finalPayment : monthlyInterest,
            principal: isLast ? principal : 0,
            interest: monthlyInterest,
            remainingPrincipal: isLast ? 0 : principal
          })
        }

        result = {
          method: 'interest_only',
          methodName: '先息后本',
          monthlyPayment: monthlyInterest,
          totalPayment,
          totalInterest: totalPayment - principal,
          finalPayment: principal,
          schedule
        }
        break
      }

      default:
        return res.status(400).json({ code: 400, message: '不支持的还款方式' })
    }

    return res.status(200).json({ code: 0, data: result })
  } catch (error) {
    console.error('Loan calculate error:', error)
    return res.status(500).json({ code: 500, message: '服务器错误' })
  }
}
