import jwt from 'jsonwebtoken'
import { supabase, memoryStorage } from '../lib/db.js'

const JWT_SECRET = process.env.JWT_SECRET || 'rongzhushou-secret-2026'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ code: 405, message: 'Method not allowed' })

  try {
    const { phone, code, password } = req.body

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ code: 400, message: '请输入正确的手机号' })
    }

    // 验证码登录
    if (code) {
      if (code !== '123456') {
        return res.status(400).json({ code: 400, message: '验证码错误' })
      }
    } else if (password) {
      if (password.length < 6) {
        return res.status(400).json({ code: 400, message: '密码错误' })
      }
    } else {
      return res.status(400).json({ code: 400, message: '请输入验证码或密码' })
    }

    let user

    if (supabase) {
      // 使用 Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        user = data
      } else {
        // 创建新用户
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            phone,
            nickname: `用户${phone.slice(-4)}`,
            points: 100
          })
          .select()
          .single()

        if (createError) throw createError
        user = newUser
      }
    } else {
      // 使用内存存储
      user = memoryStorage.users.get(phone)
      if (!user) {
        user = {
          id: `user_${Date.now()}`,
          phone,
          nickname: `用户${phone.slice(-4)}`,
          avatar: '',
          vip_level: 0,
          vip_expire_time: null,
          points: 100,
          created_at: new Date().toISOString()
        }
        memoryStorage.users.set(phone, user)
      }
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        phone: user.phone, 
        vipLevel: user.vip_level || 0 
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
          avatar: user.avatar || '',
          vipLevel: user.vip_level || 0,
          vipExpireTime: user.vip_expire_time || null,
          points: user.points || 100
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ code: 500, message: '服务器错误' })
  }
}
