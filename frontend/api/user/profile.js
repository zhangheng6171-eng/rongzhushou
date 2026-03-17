import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'rongzhushou-secret-key-2026'

// 模拟用户数据库
const users = new Map()

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // 验证 Token
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      code: 401,
      message: '未登录'
    })
  }

  const token = authHeader.slice(7)
  let decoded
  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return res.status(401).json({
      code: 401,
      message: 'Token 已过期，请重新登录'
    })
  }

  if (req.method === 'GET') {
    // 获取用户信息
    const user = users.get(decoded.phone) || {
      id: decoded.userId,
      phone: decoded.phone,
      nickname: `用户${decoded.phone.slice(-4)}`,
      vipLevel: decoded.vipLevel || 0,
      points: 100
    }

    return res.status(200).json({
      code: 0,
      data: user
    })
  }

  if (req.method === 'PUT') {
    // 更新用户信息
    const { nickname, avatar } = req.body
    const user = users.get(decoded.phone) || {
      id: decoded.userId,
      phone: decoded.phone,
      nickname: `用户${decoded.phone.slice(-4)}`,
      vipLevel: 0,
      points: 100
    }

    if (nickname) user.nickname = nickname
    if (avatar) user.avatar = avatar
    users.set(decoded.phone, user)

    return res.status(200).json({
      code: 0,
      message: '更新成功',
      data: user
    })
  }

  return res.status(405).json({ code: 405, message: 'Method not allowed' })
}
