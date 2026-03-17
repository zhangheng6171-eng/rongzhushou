/**
 * 用户登录
 * 支持手机号+验证码登录和手机号+密码登录
 */

const { Response, Validator, Logger, CodeManager, getDatabase, JWT } = require('../../common/utils');

exports.main = async (event, context) => {
  const { phone, code, password } = event;
  
  try {
    Logger.info('用户登录请求', { phone, type: code ? 'code' : 'password' });

    // 参数验证
    const validation = Validator.validate(
      { phone },
      {
        phone: { required: true, type: 'phone', message: '请输入正确的手机号' }
      }
    );

    if (!validation.valid) {
      return Response.error(400, validation.errors[0]);
    }

    // 获取数据库
    const db = getDatabase();
    const usersCollection = db.collection('users');

    // 查找用户
    const userResult = await usersCollection.where({ phone }).get();
    
    if (!userResult.data || userResult.data.length === 0) {
      // 用户不存在，自动注册流程
      if (code) {
        // 验证验证码
        const codeResult = CodeManager.verify(phone, code);
        if (!codeResult.valid) {
          return Response.error(1002, codeResult.message);
        }

        // 创建新用户
        const now = Date.now();
        const userData = {
          phone,
          nickname: `用户${phone.slice(-4)}`,
          avatar: null,
          gender: null,
          memberLevel: 0,
          memberExpireTime: null,
          createdAt: now,
          updatedAt: now,
          lastLoginAt: now
        };

        const createResult = await usersCollection.add(userData);
        
        if (!createResult.id) {
          return Response.error(500, '自动注册失败');
        }

        const token = JWT.generate({
          userId: createResult.id,
          phone
        });

        Logger.info('自动注册成功', { phone, userId: createResult.id });

        return Response.success({
          token,
          user: {
            id: createResult.id,
            phone,
            nickname: userData.nickname,
            memberLevel: userData.memberLevel
          },
          isNewUser: true
        }, '注册成功');
      }
      
      return Response.error(2001, '用户不存在');
    }

    const user = userResult.data[0];

    // 验证码登录
    if (code) {
      const codeResult = CodeManager.verify(phone, code);
      if (!codeResult.valid) {
        return Response.error(1002, codeResult.message);
      }
    } else if (password) {
      // 密码登录
      if (user.password !== password) { // 实际应使用加密比对
        return Response.error(400, '密码错误');
      }
    } else {
      return Response.error(400, '请输入验证码或密码');
    }

    // 更新最后登录时间
    await usersCollection.doc(user._id).update({
      lastLoginAt: Date.now()
    });

    // 生成Token
    const token = JWT.generate({
      userId: user._id,
      phone: user.phone
    });

    Logger.info('用户登录成功', { phone, userId: user._id });

    return Response.success({
      token,
      user: {
        id: user._id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        memberLevel: user.memberLevel,
        memberExpireTime: user.memberExpireTime
      },
      isNewUser: false
    }, '登录成功');

  } catch (error) {
    Logger.error('登录异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
