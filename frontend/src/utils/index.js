/**
 * 工具函数集合
 */

/**
 * 格式化金额
 * @param {number} value 金额
 * @param {string} prefix 前缀
 * @returns {string}
 */
export const formatMoney = (value, prefix = '¥') => {
  return prefix + Number(value).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

/**
 * 格式化百分比
 * @param {number} value 数值
 * @param {number} decimals 小数位数
 * @returns {string}
 */
export const formatPercent = (value, decimals = 2) => {
  return Number(value).toFixed(decimals) + '%'
}

/**
 * 格式化日期
 * @param {Date|string|number} date 日期
 * @param {string} format 格式
 * @returns {string}
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 相对时间格式化
 * @param {Date|string|number} date 日期
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  const now = new Date()
  const d = new Date(date)
  const diff = now - d

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  if (months < 12) return `${months}个月前`
  return `${years}年前`
}

/**
 * 格式化手机号（隐藏中间四位）
 * @param {string} phone 手机号
 * @returns {string}
 */
export const formatPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化银行卡号（隐藏中间部分）
 * @param {string} cardNo 银行卡号
 * @returns {string}
 */
export const formatCardNo = (cardNo) => {
  if (!cardNo) return ''
  return cardNo.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2')
}

/**
 * 验证手机号
 * @param {string} phone 手机号
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email 邮箱
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * 验证身份证号
 * @param {string} idCard 身份证号
 * @returns {boolean}
 */
export const isValidIdCard = (idCard) => {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)
}

/**
 * 防抖函数
 * @param {Function} fn 目标函数
 * @param {number} delay 延迟时间
 * @returns {Function}
 */
export const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param {Function} fn 目标函数
 * @param {number} interval 间隔时间
 * @returns {Function}
 */
export const throttle = (fn, interval = 300) => {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 深拷贝
 * @param {any} obj 目标对象
 * @returns {any}
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj

  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof Array) return obj.map((item) => deepClone(item))

  const clone = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key])
    }
  }
  return clone
}

/**
 * 生成UUID
 * @returns {string}
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 本地存储封装
 */
export const storage = {
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  remove(key) {
    localStorage.removeItem(key)
  },

  clear() {
    localStorage.clear()
  }
}

/**
 * Session存储封装
 */
export const sessionStorage = {
  get(key, defaultValue = null) {
    try {
      const value = window.sessionStorage.getItem(key)
      return value ? JSON.parse(value) : defaultValue
    } catch {
      return defaultValue
    }
  },

  set(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  },

  remove(key) {
    window.sessionStorage.removeItem(key)
  },

  clear() {
    window.sessionStorage.clear()
  }
}

/**
 * 下载文件
 * @param {string} url 文件URL
 * @param {string} filename 文件名
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 复制文本到剪贴板
 * @param {string} text 文本内容
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}

/**
 * 获取URL参数
 * @param {string} name 参数名
 * @param {string} url URL（默认当前页面URL）
 * @returns {string|null}
 */
export const getUrlParam = (name, url = window.location.href) => {
  const urlObj = new URL(url)
  return urlObj.searchParams.get(name)
}

/**
 * 数字转中文
 * @param {number} num 数字
 * @returns {string}
 */
export const numberToChinese = (num) => {
  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const units = ['', '十', '百', '千', '万']

  if (num === 0) return '零'
  if (num < 10) return digits[num]
  if (num < 20) return '十' + (num % 10 === 0 ? '' : digits[num % 10])

  let result = ''
  let unitIndex = 0

  while (num > 0) {
    const digit = num % 10
    if (digit !== 0) {
      result = digits[digit] + units[unitIndex] + result
    } else if (result !== '' && !result.startsWith('零')) {
      result = '零' + result
    }
    num = Math.floor(num / 10)
    unitIndex++
  }

  return result
}

export default {
  formatMoney,
  formatPercent,
  formatDate,
  formatRelativeTime,
  formatPhone,
  formatCardNo,
  isValidPhone,
  isValidEmail,
  isValidIdCard,
  debounce,
  throttle,
  deepClone,
  generateUUID,
  storage,
  sessionStorage,
  downloadFile,
  copyToClipboard,
  getUrlParam,
  numberToChinese
}
