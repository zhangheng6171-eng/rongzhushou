/**
 * AI对话历史
 * 获取用户的对话历史记录
 */

const { Response, Validator, Logger, getDatabase, getUserFromEvent } = require('../../common/utils');

exports.main = async (event, context) => {
  const { sessionId, page = 1, pageSize = 20 } = event;
  
  try {
    // 验证用户身份
    const userInfo = getUserFromEvent(event);
    if (!userInfo) {
      return Response.error(401, '未授权');
    }

    Logger.info('获取AI对话历史', { userId: userInfo.userId, sessionId, page });

    // 参数验证
    const validation = Validator.validate(
      { page, pageSize },
      {
        page: { 
          required: false, 
          type: 'number',
          validator: (v) => parseInt(v) >= 1 ? true : '页码必须大于0'
        },
        pageSize: { 
          required: false, 
          type: 'number',
          validator: (v) => parseInt(v) >= 1 && parseInt(v) <= 100 ? true : '每页数量必须在1-100之间'
        }
      }
    );

    if (!validation.valid) {
      return Response.error(400, validation.errors[0]);
    }

    const db = getDatabase();

    if (sessionId) {
      // 获取特定会话的对话记录
      const chatLogsCollection = db.collection('ai_chat_logs');
      const result = await chatLogsCollection
        .where({
          userId: userInfo.userId,
          sessionId
        })
        .orderBy('createdAt', 'asc')
        .limit(parseInt(pageSize))
        .get();

      const messages = (result.data || []).map(log => [
        { role: 'user', content: log.userMessage, timestamp: log.createdAt },
        { role: 'assistant', content: log.aiResponse, timestamp: log.createdAt }
      ]).flat();

      Logger.info('获取会话对话记录成功', { sessionId, count: messages.length });

      return Response.success({
        sessionId,
        messages,
        hasMore: result.data && result.data.length === parseInt(pageSize)
      });

    } else {
      // 获取会话列表
      const sessionsCollection = db.collection('ai_sessions');
      const skip = (parseInt(page) - 1) * parseInt(pageSize);

      // 获取总数
      const countResult = await sessionsCollection
        .where({ userId: userInfo.userId })
        .count();

      // 获取会话列表
      const result = await sessionsCollection
        .where({ userId: userInfo.userId })
        .orderBy('updatedAt', 'desc')
        .skip(skip)
        .limit(parseInt(pageSize))
        .get();

      const sessions = (result.data || []).map(session => ({
        id: session._id,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }));

      Logger.info('获取会话列表成功', { count: sessions.length, total: countResult.total });

      return Response.success({
        list: sessions,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total: countResult.total || 0,
          totalPages: Math.ceil((countResult.total || 0) / parseInt(pageSize))
        }
      });
    }

  } catch (error) {
    Logger.error('获取AI对话历史异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
