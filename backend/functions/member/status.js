/**
 * 会员状态查询
 * 获取用户会员信息和权益
 */

const { Response, Logger, getDatabase, getUserFromEvent } = require('../../common/utils');

exports.main = async (event, context) => {
  try {
    // 验证用户身份
    const userInfo = getUserFromEvent(event);
    if (!userInfo) {
      return Response.error(401, '未授权');
    }

    Logger.info('查询会员状态', { userId: userInfo.userId });

    const db = getDatabase();
    const usersCollection = db.collection('users');

    // 获取用户信息
    const userResult = await usersCollection.doc(userInfo.userId).get();
    
    if (!userResult.data || userResult.data.length === 0) {
      return Response.error(2001, '用户不存在');
    }

    const user = userResult.data[0];

    // 计算会员状态
    const now = Date.now();
    const isActiveMember = user.memberLevel > 0 && 
                           user.memberExpireTime && 
                           user.memberExpireTime > now;

    const daysRemaining = isActiveMember 
      ? Math.ceil((user.memberExpireTime - now) / (24 * 60 * 60 * 1000))
      : 0;

    // 会员等级信息
    const memberLevels = {
      0: {
        name: '普通用户',
        features: ['每日10次AI对话', '基础贷款查询', '文章浏览']
      },
      1: {
        name: '月度会员',
        features: ['无限AI对话', '专属贷款方案', '优先客服支持', '征信优化建议']
      },
      2: {
        name: '年度会员',
        features: ['无限AI对话', '专属贷款方案', '优先客服支持', '征信优化建议', '专属客户经理', 'VIP活动优先参与']
      }
    };

    const currentLevel = memberLevels[user.memberLevel] || memberLevels[0];

    // 获取会员统计数据
    const chatLogsCollection = db.collection('ai_chat_logs');
    const today = new Date().setHours(0, 0, 0, 0);
    
    const todayChatCount = await chatLogsCollection
      .where({
        userId: userInfo.userId,
        createdAt: db.command.gte(today)
      })
      .count();

    const totalChatCount = await chatLogsCollection
      .where({ userId: userInfo.userId })
      .count();

    // 获取最近的订单
    const ordersCollection = db.collection('orders');
    const recentOrderResult = await ordersCollection
      .where({
        userId: userInfo.userId,
        status: 1
      })
      .orderBy('paidAt', 'desc')
      .limit(1)
      .get();

    const recentOrder = recentOrderResult.data && recentOrderResult.data[0];

    Logger.info('会员状态查询成功', { 
      userId: userInfo.userId, 
      memberLevel: user.memberLevel,
      isActiveMember,
      daysRemaining
    });

    return Response.success({
      member: {
        level: user.memberLevel,
        levelName: currentLevel.name,
        isActive: isActiveMember,
        expireTime: user.memberExpireTime,
        daysRemaining,
        features: currentLevel.features
      },
      usage: {
        todayChatCount: todayChatCount.total || 0,
        totalChatCount: totalChatCount.total || 0,
        chatLimit: user.memberLevel > 0 ? 'unlimited' : 10
      },
      recentOrder: recentOrder ? {
        orderNo: recentOrder.orderNo,
        productName: recentOrder.productName,
        paidAt: recentOrder.paidAt
      } : null
    });

  } catch (error) {
    Logger.error('查询会员状态异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
