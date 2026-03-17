import jwt from 'jsonwebtoken'

// JWT 密钥（生产环境应使用环境变量）
const JWT_SECRET = process.env.JWT_SECRET || 'rongzhushou-secret-key-2026'

// 模拟用户数据库
const users = new Map()

export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ code: 405, message: 'Method not allowed' })
  }

  try {
    const { phone, code, password } = req.body

    // 验证手机号
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        code: 400,
        message: '请输入正确的手机号'
      })
    }

    // 验证码登录
    if (code) {
      // 模拟验证码验证（实际应从数据库/缓存验证）
      if (code !== '123456') {
        return res.status(400).json({
          code: 400,
          message: '验证码错误'
        })
      }
    }
    // 密码登录
    else if (password) {
      // 模拟密码验证
      if (password.length < 6) {
        return res.status(400).json({
          code: 400,
          message: '密码错误'
        })
      }
    } else {
      return res.status(400).json({
        code: 400,
        message: '请输入验证码或密码'
      })
    }

    // 查找或创建用户
    let user = users.get(phone)
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        phone,
        nickname: `用户${phone.slice(-4)}`,
        avatar: '',
        vipLevel: 0,
        vipExpireTime: null,
        points: 100, // 新用户赠送100积分
        createdAt: new Date().toISOString()
      }
      users.set(phone, user)
    }

    // 生成 JWT Token
    const token = jwt.sign(
      { 
        userId: user.id, 
        phone: user.phone,
        vipLevel: user.vipLevel 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      code: 0,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          nickname: user.nickname,
          avatar: user.avatar,
          vipLevel: user.vipLevel,
          vipExpireTime: user.vipExpireTime,
          points: user.points
        }
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}
