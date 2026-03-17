/**
 * AI对话接口
 * 智能融资顾问对话
 */

const { Response, Validator, Logger, getDatabase, getUserFromEvent } = require('../../common/utils');

exports.main = async (event, context) => {
  const { message, sessionId, context: userContext } = event;
  
  try {
    // 验证用户身份
    const userInfo = getUserFromEvent(event);
    if (!userInfo) {
      return Response.error(401, '未授权');
    }

    Logger.info('AI对话请求', { userId: userInfo.userId, sessionId });

    // 参数验证
    const validation = Validator.validate(
      { message },
      {
        message: { 
          required: true, 
          validator: (v) => v && v.length > 0 && v.length <= 2000 ? true : '消息长度必须在1-2000字符之间'
        }
      }
    );

    if (!validation.valid) {
      return Response.error(400, validation.errors[0]);
    }

    const db = getDatabase();

    // 检查用户会员状态（免费用户每日对话次数限制）
    const usersCollection = db.collection('users');
    const userResult = await usersCollection.doc(userInfo.userId).get();
    const user = userResult.data && userResult.data[0];

    if (!user) {
      return Response.error(2001, '用户不存在');
    }

    // 检查会员状态
    const isMember = user.memberLevel > 0 && 
                     user.memberExpireTime && 
                     user.memberExpireTime > Date.now();

    // 非会员用户检查每日对话次数
    if (!isMember) {
      const today = new Date().setHours(0, 0, 0, 0);
      const chatLogsCollection = db.collection('ai_chat_logs');
      const todayCount = await chatLogsCollection
        .where({
          userId: userInfo.userId,
          createdAt: db.command.gte(today)
        })
        .count();

      if (todayCount.total >= 10) {
        return Response.error(3001, '今日对话次数已达上限，请开通会员享受无限对话');
      }
    }

    // 生成AI回复（这里使用模拟响应，生产环境应接入真实AI模型）
    const aiResponse = await generateAIResponse(message, userContext, user);

    // 创建或获取会话
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const sessionsCollection = db.collection('ai_sessions');
      const sessionResult = await sessionsCollection.add({
        userId: userInfo.userId,
        title: message.substring(0, 30),
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      currentSessionId = sessionResult.id;
    }

    // 保存对话记录
    const chatLogsCollection = db.collection('ai_chat_logs');
    await chatLogsCollection.add({
      userId: userInfo.userId,
      sessionId: currentSessionId,
      userMessage: message,
      aiResponse: aiResponse.content,
      createdAt: Date.now()
    });

    // 更新会话时间
    const sessionsCollection = db.collection('ai_sessions');
    await sessionsCollection.doc(currentSessionId).update({
      updatedAt: Date.now()
    });

    Logger.info('AI对话完成', { userId: userInfo.userId, sessionId: currentSessionId });

    return Response.success({
      sessionId: currentSessionId,
      response: aiResponse.content,
      suggestions: aiResponse.suggestions,
      isMember
    });

  } catch (error) {
    Logger.error('AI对话异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};

/**
 * 生成AI回复（模拟）
 * 生产环境应接入真实AI模型（如腾讯混元、OpenAI等）
 */
async function generateAIResponse(message, context, user) {
  // 基于关键词的简单智能回复
  const lowerMessage = message.toLowerCase();
  
  // 贷款产品相关
  if (lowerMessage.includes('贷款') || lowerMessage.includes('借钱') || lowerMessage.includes('融资')) {
    return {
      content: `您好${user.nickname}，我是您的专属融资顾问。针对您的需求，我为您推荐以下方案：

**小微企业经营贷款**
- 额度：最高300万元
- 期限：1-3年
- 利率：年化4.35%起
- 还款方式：等额本息/先息后本

**申请条件**
✓ 企业注册满2年
✓ 年营业额≥100万
✓ 法人信用良好

您可以根据企业情况选择适合的产品，需要我为您详细解答吗？`,
      suggestions: ['如何申请贷款？', '需要哪些材料？', '利率是多少？']
    };
  }

  // 信用评估相关
  if (lowerMessage.includes('征信') || lowerMessage.includes('信用') || lowerMessage.includes('评分')) {
    return {
      content: `征信是贷款审批的重要参考。以下是提升信用评分的建议：

**信用优化建议**
1. 按时还款，避免逾期
2. 保持合理的负债率（<50%）
3. 避免频繁申请贷款
4. 维护良好的企业纳税记录

**您的信用状况**
基于您的历史数据，初步评估信用等级为：**良好**

建议保持当前良好的还款习惯，这将有助于获得更优惠的贷款利率。`,
      suggestions: ['如何查询征信？', '征信不好怎么办？', '多久更新一次？']
    };
  }

  // 利息计算相关
  if (lowerMessage.includes('利息') || lowerMessage.includes('利率') || lowerMessage.includes('还款')) {
    return {
      content: `我来帮您计算一下贷款成本：

**常见贷款利率参考**
• 经营贷：年化4.35%-8%
• 信用贷：年化8%-15%
• 抵押贷：年化3.85%-6%

**还款方式对比**
1. **等额本息**：月供固定，适合收入稳定的客户
2. **先息后本**：前期压力小，适合短期周转
3. **随借随还**：按天计息，灵活方便

您想了解具体的还款金额吗？我可以为您详细计算。`,
      suggestions: ['帮我计算月供', '哪种还款方式好？', '可以提前还款吗？']
    };
  }

  // 默认回复
  return {
    content: `您好${user.nickname}，我是融智助手，专注于为小微企业提供融资咨询服务。

我可以帮助您：
📌 了解各类贷款产品
📌 评估企业融资需求
📌 计算贷款成本
📌 提供征信优化建议
📌 推荐最适合的贷款方案

请问有什么可以帮助您的？`,
    suggestions: ['推荐贷款产品', '评估融资需求', '计算贷款成本']
  };
}
