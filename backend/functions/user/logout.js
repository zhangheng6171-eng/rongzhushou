/**
 * 用户登出
 * 用于清除服务端会话（如需要）
 */

const { Response, Logger, getUserFromEvent } = require('../../common/utils');

exports.main = async (event, context) => {
  try {
    // 验证用户身份
    const userInfo = getUserFromEvent(event);
    
    if (!userInfo) {
      return Response.error(401, '未授权');
    }

    Logger.info('用户登出', { userId: userInfo.userId });

    // JWT是无状态的，这里可以：
    // 1. 将Token加入黑名单（需要Redis支持）
    // 2. 记录登出日志
    // 3. 清除其他服务端会话数据

    // 记录登出日志到数据库（如果需要）
    try {
      const { getDatabase } = require('../../common/utils');
      const db = getDatabase();
      await db.collection('user_logs').add({
        userId: userInfo.userId,
        action: 'logout',
        timestamp: Date.now(),
        ip: event.headers?.['x-real-ip'] || event.headers?.['x-forwarded-for']
      });
    } catch (logError) {
      Logger.warn('登出日志记录失败', { error: logError.message });
    }

    return Response.success(null, '登出成功');

  } catch (error) {
    Logger.error('登出异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
