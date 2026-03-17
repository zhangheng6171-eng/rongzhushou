/**
 * 用户注册
 * 支持手机号+验证码注册
 */

const { Response, Validator, Logger, CodeManager, getDatabase, JWT } = require('../../common/utils');

exports.main = async (event, context) => {
  const { phone, code, password, nickname } = event;
  
  try {
    Logger.info('用户注册请求', { phone });

    // 参数验证
    const validation = Validator.validate(
      { phone, code },
      {
        phone: { required: true, type: 'phone', message: '请输入正确的手机号' },
        code: { required: true, message: '请输入验证码' }
      }
    );

    if (!validation.valid) {
      return Response.error(400, validation.errors[0]);
    }

    // 验证验证码
    const codeResult = CodeManager.verify(phone, code);
    if (!codeResult.valid) {
      return Response.error(1002, codeResult.message);
    }

    // 获取数据库
    const db = getDatabase();
    const usersCollection = db.collection('users');

    // 检查用户是否已存在
    const existUser = await usersCollection.where({ phone }).get();
    if (existUser.data && existUser.data.length > 0) {
      return Response.error(2002, '该手机号已注册');
    }

    // 创建用户
    const now = Date.now();
    const userData = {
      phone,
      nickname: nickname || `用户${phone.slice(-4)}`,
      password: password || null, // 实际应加密存储
      avatar: null,
      gender: null,
      memberLevel: 0, // 0-普通用户 1-月度会员 2-年度会员
      memberExpireTime: null,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now
    };

    const result = await usersCollection.add(userData);
    
    if (!result.id) {
      Logger.error('用户创建失败', { phone });
      return Response.error(500, '注册失败，请稍后重试');
    }

    // 生成Token
    const token = JWT.generate({
      userId: result.id,
      phone
    });

    Logger.info('用户注册成功', { phone, userId: result.id });

    return Response.success({
      token,
      user: {
        id: result.id,
        phone,
        nickname: userData.nickname,
        memberLevel: userData.memberLevel
      }
    }, '注册成功');

  } catch (error) {
    Logger.error('注册异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
