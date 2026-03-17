/**
 * 支付回调处理
 * 处理支付成功后的订单状态更新
 */

const { Response, Validator, Logger, getDatabase } = require('../../common/utils');

exports.main = async (event, context) => {
  const { 
    orderNo,
    transactionId,
    paymentResult
  } = event;
  
  try {
    Logger.info('支付回调', { orderNo, transactionId, paymentResult });

    // 参数验证
    if (!orderNo) {
      return Response.error(400, '订单号不能为空');
    }

    const db = getDatabase();
    const ordersCollection = db.collection('orders');

    // 查询订单
    const orderResult = await ordersCollection.where({ orderNo }).get();
    
    if (!orderResult.data || orderResult.data.length === 0) {
      return Response.error(404, '订单不存在');
    }

    const order = orderResult.data[0];

    // 检查订单状态
    if (order.status !== 0) {
      return Response.error(400, '订单状态不正确');
    }

    // 检查订单是否过期
    if (Date.now() > order.expiredAt) {
      await ordersCollection.doc(order._id).update({
        status: 2,
        updatedAt: Date.now()
      });
      return Response.error(400, '订单已过期');
    }

    // 支付成功处理
    if (paymentResult === 'success') {
      // 更新订单状态
      await ordersCollection.doc(order._id).update({
        status: 1,
        transactionId,
        paidAt: Date.now(),
        updatedAt: Date.now()
      });

      // 更新用户会员状态
      const usersCollection = db.collection('users');
      const userResult = await usersCollection.doc(order.userId).get();
      const user = userResult.data && userResult.data[0];

      if (user) {
        // 计算会员到期时间
        const now = Date.now();
        let memberExpireTime;
        
        if (user.memberExpireTime && user.memberExpireTime > now) {
          // 如果当前有会员，在原有基础上延期
          memberExpireTime = user.memberExpireTime + order.duration * 24 * 60 * 60 * 1000;
        } else {
          memberExpireTime = now + order.duration * 24 * 60 * 60 * 1000;
        }

        await usersCollection.doc(order.userId).update({
          memberLevel: order.memberLevel,
          memberExpireTime,
          updatedAt: Date.now()
        });

        Logger.info('会员开通成功', { 
          userId: order.userId, 
          memberLevel: order.memberLevel,
          memberExpireTime 
        });
      }

      // 记录支付日志
      const paymentLogsCollection = db.collection('payment_logs');
      await paymentLogsCollection.add({
        orderNo,
        userId: order.userId,
        amount: order.amount,
        transactionId,
        paymentMethod: order.paymentMethod,
        createdAt: Date.now()
      });

      return Response.success({
        orderNo,
        status: 'paid',
        memberLevel: order.memberLevel,
        memberExpireTime: user ? user.memberExpireTime : null
      }, '支付成功');

    } else {
      // 支付失败
      await ordersCollection.doc(order._id).update({
        status: 3,
        updatedAt: Date.now()
      });

      return Response.error(4001, '支付失败');
    }

  } catch (error) {
    Logger.error('支付回调异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
