import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'rongzhushou-secret-2026'
const users = new Map()

const packages = {
  monthly: { name: '月度会员', price: 29, days: 30, level: 1 },
  yearly: { name: '年度会员', price: 199, days: 365, level: 1 },
  premium: { name: '超级会员', price: 499, days: 365, level: 2 }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ code: 405, message: 'Method not allowed' })

  // 验证 Token
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未登录' })
  }

  const token = authHeader.slice(7)
  let decoded
  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return res.status(401).json({ code: 401, message: 'Token已过期' })
  }

  try {
    const { packageId, paymentMethod } = req.body

    const pkg = packages[packageId]
    if (!pkg) {
      return res.status(400).json({ code: 400, message: '无效的套餐' })
    }

    // 模拟支付成功
    const user = users.get(decoded.phone) || {
      id: decoded.userId,
      phone: decoded.phone,
      nickname: `用户${decoded.phone.slice(-4)}`,
      vipLevel: 0,
      points: 100
    }

    // 更新会员状态
    user.vipLevel = pkg.level
    const expireDate = new Date()
    expireDate.setDate(expireDate.getDate() + pkg.days)
    user.vipExpireTime = expireDate.toISOString()
    users.set(decoded.phone, user)

    return res.status(200).json({
      code: 0,
      message: '订阅成功',
      data: {
        orderId: `order_${Date.now()}`,
        package: pkg,
        vipExpireTime: user.vipExpireTime
      }
    })
  } catch (error) {
    console.error('Subscribe error:', error)
    return res.status(500).json({ code: 500, message: '服务器错误' })
  }
}
