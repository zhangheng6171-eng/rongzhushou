import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'rongzhushou-secret-key-2026'

// 模拟短信验证码存储
const smsCodes = new Map()

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
    const { phone } = req.body

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        code: 400,
        message: '请输入正确的手机号'
      })
    }

    // 检查发送频率（60秒内只能发一次）
    const lastSent = smsCodes.get(phone)
    if (lastSent && Date.now() - lastSent.time < 60000) {
      const remaining = Math.ceil((60000 - (Date.now() - lastSent.time)) / 1000)
      return res.status(429).json({
        code: 429,
        message: `请${remaining}秒后再试`
      })
    }

    // 生成6位验证码
    const code = '123456' // 测试环境固定验证码
    smsCodes.set(phone, { code, time: Date.now() })

    // 实际环境应调用短信服务发送
    console.log(`[SMS] 发送验证码到 ${phone}: ${code}`)

    return res.status(200).json({
      code: 0,
      message: '验证码已发送',
      data: {
        // 测试环境返回验证码，生产环境应删除
        code: process.env.NODE_ENV === 'development' ? code : undefined
      }
    })

  } catch (error) {
    console.error('SMS error:', error)
    return res.status(500).json({
      code: 500,
      message: '服务器错误'
    })
  }
}
