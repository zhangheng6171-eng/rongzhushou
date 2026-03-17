/**
 * 用户个人资料管理
 * GET: 获取资料
 * PUT: 更新资料
 */

const { Response, Validator, Logger, getDatabase, getUserFromEvent } = require('../../common/utils');

exports.main = async (event, context) => {
  const method = event.method || 'GET';
  
  try {
    // 验证用户身份
    const userInfo = getUserFromEvent(event);
    if (!userInfo) {
      return Response.error(401, '未授权');
    }

    const db = getDatabase();
    const usersCollection = db.collection('users');

    if (method === 'GET') {
      // 获取用户资料
      Logger.info('获取用户资料', { userId: userInfo.userId });

      const result = await usersCollection.doc(userInfo.userId).get();
      
      if (!result.data || result.data.length === 0) {
        return Response.error(2001, '用户不存在');
      }

      const user = result.data[0];
      
      return Response.success({
        id: user._id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar,
        gender: user.gender,
        birthday: user.birthday,
        company: user.company,
        position: user.position,
        memberLevel: user.memberLevel,
        memberExpireTime: user.memberExpireTime,
        createdAt: user.createdAt
      });

    } else if (method === 'PUT' || method === 'POST') {
      // 更新用户资料
      Logger.info('更新用户资料', { userId: userInfo.userId, fields: Object.keys(event).filter(k => !['method', 'headers'].includes(k)) });

      const { nickname, avatar, gender, birthday, company, position } = event;

      // 构建更新数据
      const updateData = {
        updatedAt: Date.now()
      };

      if (nickname !== undefined) {
        if (nickname && nickname.length > 20) {
          return Response.error(400, '昵称不能超过20个字符');
        }
        updateData.nickname = nickname;
      }

      if (avatar !== undefined) {
        updateData.avatar = avatar;
      }

      if (gender !== undefined) {
        if (![0, 1, 2].includes(gender)) {
          return Response.error(400, '性别参数错误');
        }
        updateData.gender = gender;
      }

      if (birthday !== undefined) {
        updateData.birthday = birthday;
      }

      if (company !== undefined) {
        updateData.company = company;
      }

      if (position !== undefined) {
        updateData.position = position;
      }

      // 更新数据库
      await usersCollection.doc(userInfo.userId).update(updateData);

      Logger.info('用户资料更新成功', { userId: userInfo.userId });

      return Response.success(null, '更新成功');

    } else {
      return Response.error(400, '不支持的请求方法');
    }

  } catch (error) {
    Logger.error('个人资料操作异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
