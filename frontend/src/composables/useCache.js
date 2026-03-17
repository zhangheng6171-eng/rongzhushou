import { ref, watch } from 'vue'

/**
 * 缓存管理Hook
 */
export function useCache(key, defaultValue = null, options = {}) {
  const {
    ttl = 0, // 缓存过期时间（毫秒），0表示永不过期
    storage = 'local' // 存储方式：local 或 session
  } = options

  const storageObj = storage === 'session' ? sessionStorage : localStorage

  // 从存储中读取初始值
  const getStoredValue = () => {
    try {
      const item = storageObj.getItem(key)
      if (!item) return defaultValue

      const { value, expireAt } = JSON.parse(item)

      // 检查是否过期
      if (expireAt && Date.now() > expireAt) {
        storageObj.removeItem(key)
        return defaultValue
      }

      return value
    } catch {
      return defaultValue
    }
  }

  const data = ref(getStoredValue())

  // 保存到存储
  const save = () => {
    try {
      const item = {
        value: data.value,
        expireAt: ttl > 0 ? Date.now() + ttl : null
      }
      storageObj.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.error('Failed to save cache:', error)
    }
  }

  // 监听变化自动保存
  watch(data, save, { deep: true })

  // 清除缓存
  const clear = () => {
    data.value = defaultValue
    storageObj.removeItem(key)
  }

  // 刷新缓存
  const refresh = () => {
    data.value = getStoredValue()
  }

  return {
    data,
    clear,
    refresh
  }
}

/**
 * 缓存管理器
 */
export class CacheManager {
  constructor(options = {}) {
    this.prefix = options.prefix || 'app_cache_'
    this.defaultTTL = options.defaultTTL || 0
  }

  getKey(key) {
    return this.prefix + key
  }

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.getKey(key))
      if (!item) return defaultValue

      const { value, expireAt } = JSON.parse(item)

      if (expireAt && Date.now() > expireAt) {
        this.remove(key)
        return defaultValue
      }

      return value
    } catch {
      return defaultValue
    }
  }

  set(key, value, ttl = this.defaultTTL) {
    try {
      const item = {
        value,
        expireAt: ttl > 0 ? Date.now() + ttl : null,
        createdAt: Date.now()
      }
      localStorage.setItem(this.getKey(key), JSON.stringify(item))
      return true
    } catch {
      return false
    }
  }

  remove(key) {
    localStorage.removeItem(this.getKey(key))
  }

  has(key) {
    return this.get(key) !== null
  }

  clear() {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(this.prefix)
    )
    keys.forEach((k) => localStorage.removeItem(k))
  }

  // 获取缓存统计
  getStats() {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(this.prefix)
    )

    let totalSize = 0
    let expiredCount = 0

    keys.forEach((k) => {
      const item = localStorage.getItem(k)
      if (item) {
        totalSize += item.length

        try {
          const { expireAt } = JSON.parse(item)
          if (expireAt && Date.now() > expireAt) {
            expiredCount++
          }
        } catch {
          // ignore
        }
      }
    })

    return {
      count: keys.length,
      expiredCount,
      totalSize: (totalSize / 1024).toFixed(2) + ' KB'
    }
  }

  // 清理过期缓存
  cleanup() {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith(this.prefix)
    )

    let cleaned = 0
    keys.forEach((k) => {
      const item = localStorage.getItem(k)
      if (item) {
        try {
          const { expireAt } = JSON.parse(item)
          if (expireAt && Date.now() > expireAt) {
            localStorage.removeItem(k)
            cleaned++
          }
        } catch {
          // ignore
        }
      }
    })

    return cleaned
  }
}

// 默认缓存管理器实例
export const cacheManager = new CacheManager({
  prefix: 'rongzhi_',
  defaultTTL: 3600000 // 默认1小时过期
})

export default {
  useCache,
  CacheManager,
  cacheManager
}
