/**
 * 公共工具模块
 * 包含：统一响应、参数验证、JWT处理、日志记录
 */

const jwt = require('jsonwebtoken');

// JWT密钥（生产环境应使用环境变量）
const JWT_SECRET = process.env.JWT_SECRET || 'rongzhi-assistant-secret-key-2024';
const JWT_EXPIRES_IN = '7d';

/**
 * 统一API响应格式
 */
class Response {
  static success(data = {}, message = 'success') {
    return {
      code: 0,
      message,
      data,
      timestamp: Date.now()
    };
  }

  static error(code = -1, message = 'error', data = null) {
    return {
      code,
      message,
      data,
      timestamp: Date.now()
    };
  }

  // 常见错误码
  static errors = {
    PARAM_ERROR: { code: 400, message: '参数错误' },
    UNAUTHORIZED: { code: 401, message: '未授权' },
    FORBIDDEN: { code: 403, message: '禁止访问' },
    NOT_FOUND: { code: 404, message: '资源不存在' },
    SERVER_ERROR: { code: 500, message: '服务器内部错误' },
    SMS_SEND_FAILED: { code: 1001, message: '短信发送失败' },
    SMS_CODE_ERROR: { code: 1002, message: '验证码错误' },
    USER_NOT_EXISTS: { code: 2001, message: '用户不存在' },
    USER_EXISTS: { code: 2002, message: '用户已存在' },
    MEMBER_EXPIRED: { code: 3001, message: '会员已过期' },
    PAY_FAILED: { code: 4001, message: '支付失败' }
  };
}

/**
 * 参数验证工具
 */
class Validator {
  static isPhone(value) {
    return /^1[3-9]\d{9}$/.test(value);
  }

  static isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  static isNotEmpty(value) {
    return value !== null && value !== undefined && value !== '';
  }

  static isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  static isPositiveNumber(value) {
    return this.isNumber(value) && parseFloat(value) > 0;
  }

  static inRange(value, min, max) {
    const num = parseFloat(value);
    return this.isNumber(value) && num >= min && num <= max;
  }

  static isValidId(value) {
    return typeof value === 'string' && value.length > 0;
  }

  /**
   * 批量验证参数
   * @param {Object} params - 参数对象
   * @param {Object} rules - 验证规则 { field: { required, type, validator, message } }
   * @returns {Object} { valid, errors }
   */
  static validate(params, rules) {
    const errors = [];
    
    for (const [field, rule] of Object.entries(rules)) {
      const value = params[field];
      
      // 必填验证
      if (rule.required && !this.isNotEmpty(value)) {
        errors.push(rule.message || `${field}不能为空`);
        continue;
      }
      
      // 如果非必填且为空，跳过后续验证
      if (!this.isNotEmpty(value)) continue;
      
      // 类型验证
      if (rule.type === 'phone' && !this.isPhone(value)) {
        errors.push(rule.message || `${field}格式不正确`);
      } else if (rule.type === 'email' && !this.isEmail(value)) {
        errors.push(rule.message || `${field}格式不正确`);
      } else if (rule.type === 'number' && !this.isNumber(value)) {
        errors.push(rule.message || `${field}必须是数字`);
      } else if (rule.type === 'positiveNumber' && !this.isPositiveNumber(value)) {
        errors.push(rule.message || `${field}必须是正数`);
      }
      
      // 自定义验证器
      if (rule.validator && typeof rule.validator === 'function') {
        const result = rule.validator(value);
        if (result !== true) {
          errors.push(result || rule.message || `${field}验证失败`);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

/**
 * JWT工具类
 */
class JWT {
  /**
   * 生成Token
   */
  static generate(payload, expiresIn = JWT_EXPIRES_IN) {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn });
    } catch (error) {
      console.error('JWT生成失败:', error);
      return null;
    }
  }

  /**
   * 验证Token
   */
  static verify(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('JWT验证失败:', error);
      return null;
    }
  }

  /**
   * 解码Token（不验证签名）
   */
  static decode(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}

/**
 * 日志工具
 */
class Logger {
  static format(level, message, data = null) {
    const log = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
    return JSON.stringify(log);
  }

  static info(message, data = null) {
    console.log(this.format('INFO', message, data));
  }

  static error(message, data = null) {
    console.error(this.format('ERROR', message, data));
  }

  static warn(message, data = null) {
    console.warn(this.format('WARN', message, data));
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(this.format('DEBUG', message, data));
    }
  }
}

/**
 * 验证码管理（内存存储，生产环境应使用Redis）
 */
class CodeManager {
  static codes = new Map();
  
  // 验证码有效期（5分钟）
  static EXPIRE_TIME = 5 * 60 * 1000;

  /**
   * 生成验证码
   */
  static generate(phone) {
    const code = Math.random().toString().slice(-6);
    this.codes.set(phone, {
      code,
      expiresAt: Date.now() + this.EXPIRE_TIME,
      attempts: 0
    });
    return code;
  }

  /**
   * 验证验证码
   */
  static verify(phone, inputCode) {
    const record = this.codes.get(phone);
    
    if (!record) {
      return { valid: false, message: '验证码不存在' };
    }
    
    if (Date.now() > record.expiresAt) {
      this.codes.delete(phone);
      return { valid: false, message: '验证码已过期' };
    }
    
    if (record.attempts >= 3) {
      this.codes.delete(phone);
      return { valid: false, message: '验证尝试次数过多' };
    }
    
    if (record.code !== inputCode) {
      record.attempts++;
      return { valid: false, message: '验证码错误' };
    }
    
    this.codes.delete(phone);
    return { valid: true };
  }

  /**
   * 清理过期验证码
   */
  static cleanup() {
    const now = Date.now();
    for (const [phone, record] of this.codes.entries()) {
      if (now > record.expiresAt) {
        this.codes.delete(phone);
      }
    }
  }
}

/**
 * 获取CloudBase数据库实例
 */
function getDatabase() {
  const tcb = require('@cloudbase/node-sdk');
  const app = tcb.init({
    env: process.env.TCB_ENV || process.env.SCf_ENVIRONMENT
  });
  return app.database();
}

/**
 * 从请求头获取用户信息
 */
function getUserFromEvent(event) {
  const auth = event.headers?.authorization || event.headers?.Authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return null;
  }
  
  const token = auth.substring(7);
  return JWT.verify(token);
}

module.exports = {
  Response,
  Validator,
  JWT,
  Logger,
  CodeManager,
  getDatabase,
  getUserFromEvent
};
