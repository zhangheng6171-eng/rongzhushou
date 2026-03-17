/**
 * 数据库连接封装
 * CloudBase 数据库操作工具类
 */

const tcb = require('@cloudbase/node-sdk')

// 初始化 CloudBase SDK
const app = tcb.init({
  env: process.env.TCB_ENV || process.env.SCF_NAMESPACE
})

const db = app.database()
const _ = db.command

/**
 * 数据库操作封装类
 */
class Database {
  constructor(collectionName) {
    this.collection = db.collection(collectionName)
  }

  /**
   * 创建文档
   * @param {Object} data - 文档数据
   * @returns {Promise<Object>}
   */
  async create(data) {
    const result = await this.collection.add({
      ...data,
      createdAt: db.serverDate(),
      updatedAt: db.serverDate()
    })
    return result
  }

  /**
   * 批量创建文档
   * @param {Array} dataList - 文档数据数组
   * @returns {Promise<Object>}
   */
  async createMany(dataList) {
    const result = await this.collection.add(
      dataList.map(data => ({
        ...data,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }))
    )
    return result
  }

  /**
   * 根据ID查询文档
   * @param {string} id - 文档ID
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const result = await this.collection.doc(id).get()
    return result.data && result.data.length > 0 ? result.data[0] : null
  }

  /**
   * 查询单个文档
   * @param {Object} condition - 查询条件
   * @returns {Promise<Object|null>}
   */
  async findOne(condition) {
    const result = await this.collection.where(condition).limit(1).get()
    return result.data && result.data.length > 0 ? result.data[0] : null
  }

  /**
   * 查询多个文档
   * @param {Object} condition - 查询条件
   * @param {Object} options - 查询选项
   * @returns {Promise<Array>}
   */
  async findMany(condition, options = {}) {
    let query = this.collection.where(condition)
    
    if (options.orderBy) {
      query = query.orderBy(options.orderBy.field, options.orderBy.order || 'desc')
    }
    
    if (options.skip) {
      query = query.skip(options.skip)
    }
    
    if (options.limit) {
      query = query.limit(options.limit)
    }
    
    if (options.field) {
      query = query.field(options.field)
    }
    
    const result = await query.get()
    return result.data || []
  }

  /**
   * 分页查询
   * @param {Object} condition - 查询条件
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @param {Object} options - 其他选项
   * @returns {Promise<Object>}
   */
  async paginate(condition, page = 1, pageSize = 10, options = {}) {
    const skip = (page - 1) * pageSize
    let query = this.collection.where(condition)
    
    if (options.orderBy) {
      query = query.orderBy(options.orderBy.field, options.orderBy.order || 'desc')
    }
    
    // 获取总数
    const countResult = await this.collection.where(condition).count()
    const total = countResult.total
    
    // 获取数据
    const data = await this.findMany(condition, {
      ...options,
      skip,
      limit: pageSize
    })
    
    return {
      list: data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }

  /**
   * 更新文档
   * @param {string} id - 文档ID
   * @param {Object} data - 更新数据
   * @returns {Promise<Object>}
   */
  async updateById(id, data) {
    const result = await this.collection.doc(id).update({
      ...data,
      updatedAt: db.serverDate()
    })
    return result
  }

  /**
   * 条件更新
   * @param {Object} condition - 查询条件
   * @param {Object} data - 更新数据
   * @returns {Promise<Object>}
   */
  async updateMany(condition, data) {
    const result = await this.collection.where(condition).update({
      ...data,
      updatedAt: db.serverDate()
    })
    return result
  }

  /**
   * 删除文档
   * @param {string} id - 文档ID
   * @returns {Promise<Object>}
   */
  async deleteById(id) {
    const result = await this.collection.doc(id).remove()
    return result
  }

  /**
   * 条件删除
   * @param {Object} condition - 查询条件
   * @returns {Promise<Object>}
   */
  async deleteMany(condition) {
    const result = await this.collection.where(condition).remove()
    return result
  }

  /**
   * 原子操作：增加
   * @param {string} id - 文档ID
   * @param {string} field - 字段名
   * @param {number} value - 增加的值
   * @returns {Promise<Object>}
   */
  async increment(id, field, value = 1) {
    const result = await this.collection.doc(id).update({
      [field]: _.inc(value),
      updatedAt: db.serverDate()
    })
    return result
  }

  /**
   * 原子操作：数组添加
   * @param {string} id - 文档ID
   * @param {string} field - 字段名
   * @param {Array} values - 要添加的值
   * @returns {Promise<Object>}
   */
  async push(id, field, values) {
    const result = await this.collection.doc(id).update({
      [field]: _.push(values),
      updatedAt: db.serverDate()
    })
    return result
  }
}

// 导出数据库实例和操作符
module.exports = {
  db,
  _,
  Database,
  // 常用集合
  users: new Database('users'),
  articles: new Database('articles'),
  orders: new Database('orders'),
  smsCodes: new Database('sms_codes'),
  pointsLogs: new Database('points_logs'),
  aiChatHistory: new Database('ai_chat_history')
}
