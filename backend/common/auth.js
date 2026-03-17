/**
 * JWT认证中间件
 * 用于验证用户Token和生成Token
 */

const jwt = require('jsonwebtoken')
const { users } = require('./db')

// JWT密钥，实际项目中应从环境变量获取
const JWT_SECRET = process.env.JWT_SECRET || 'rongzhi-assistant-secret-key-2024'
const JWT_EXPIRES_IN = '7d' // Token有效期7天

/**
 * 生成Token
 * @param {Object} payload - 要编码的数据
 * @returns {string} JWT Token
 */
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  })
}

/**
 * 验证Token
 * @param {string} token - JWT Token
 * @returns {Object|null} 解码后的数据，如果无效返回null
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

/**
 * 验证用户Token的云函数入口
 * 用于需要验证用户身份的场景
 */
exports.main = async (event, context) => {
  const { event: eventType, ...params } = event

  switch (eventType) {
    case 'verify':
      return await verifyHandler(params)
    case 'generate':
      return await generateHandler(params)
    default:
      return {
        code: 400,
        message: '未知的操作类型'
      }
  }
}

/**
 * 验证Token处理器
 */
async function verifyHandler(params) {
  const { token } = params

  if (!token) {
    return {
      code: 401,
      message: 'Token不能为空'
    }
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return {
      code: 401,
      message: 'Token无效或已过期'
    }
  }

  // 查询用户是否存在
  const user = await users.findById(decoded.userId)
  if (!user) {
    return {
      code: 401,
      message: '用户不存在'
    }
  }

  // 返回用户信息和验证状态
  return {
    code: 0,
    data: {
      valid: true,
      user: {
        id: user._id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        isVip: user.isVip,
        vipExpireAt: user.vipExpireAt,
        points: user.points
      }
    }
  }
}

/**
 * 生成Token处理器
 */
async function generateHandler(params) {
  const { userId, phone } = params

  if (!userId || !phone) {
    return {
      code: 400,
      message: '参数不完整'
    }
  }

  const token = generateToken({ userId, phone })

  return {
    code: 0,
    data: {
      token,
      expiresIn: JWT_EXPIRES_IN
    }
  }
}

/**
 * 中间件函数 - 验证请求中的Token
 * 返回解析后的用户信息
 */
async function authMiddleware(event) {
  // 从请求头或参数中获取Token
  const token = event.token || 
                (event.headers && event.headers['Authorization'] && 
                 event.headers['Authorization'].replace('Bearer ', ''))

  if (!token) {
    throw new Error('UNAUTHORIZED')
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    throw new Error('INVALID_TOKEN')
  }

  const user = await users.findById(decoded.userId)
  if (!user) {
    throw new Error('USER_NOT_FOUND')
  }

  return user
}

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware
}
