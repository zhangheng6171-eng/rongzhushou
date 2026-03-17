/**
 * 会员订阅
 * 创建会员订阅订单
 */

const { Response, Validator, Logger, getDatabase, getUserFromEvent } = require('../../common/utils');

exports.main = async (event, context) => {
  const { 
    planType,        // 套餐类型：monthly/yearly
    couponCode       // 优惠券代码（可选）
  } = event;
  
  try {
    // 验证用户身份
    const userInfo = getUserFromEvent(event);
    if (!userInfo) {
      return Response.error(401, '未授权');
    }

    Logger.info('会员订阅请求', { userId: userInfo.userId, planType, couponCode });

    // 参数验证
    const validation = Validator.validate(
      { planType },
      {
        planType: { 
          required: true,
          validator: (v) => ['monthly', 'yearly'].includes(v) ? true : '套餐类型不正确'
        }
      }
    );

    if (!validation.valid) {
      return Response.error(400, validation.errors[0]);
    }

    const db = getDatabase();

    // 获取套餐信息
    const plans = {
      monthly: {
        name: '月度会员',
        price: 29.9,
        originalPrice: 49.9,
        duration: 30,
        level: 1,
        features: ['无限AI对话', '专属贷款方案', '优先客服支持', '征信优化建议']
      },
      yearly: {
        name: '年度会员',
        price: 299,
        originalPrice: 598.8,
        duration: 365,
        level: 2,
        features: ['无限AI对话', '专属贷款方案', '优先客服支持', '征信优化建议', '专属客户经理', 'VIP活动优先参与']
      }
    };

    const plan = plans[planType];

    // 检查用户当前会员状态
    const usersCollection = db.collection('users');
    const userResult = await usersCollection.doc(userInfo.userId).get();
    const user = userResult.data && userResult.data[0];

    if (!user) {
      return Response.error(2001, '用户不存在');
    }

    // 计算优惠（如果有优惠券）
    let discount = 0;
    let finalPrice = plan.price;

    if (couponCode) {
      const couponsCollection = db.collection('coupons');
      const couponResult = await couponsCollection
        .where({
          code: couponCode,
          status: 0, // 0-未使用
          minAmount: db.command.lte(plan.price)
        })
        .get();

      if (couponResult.data && couponResult.data.length > 0) {
        const coupon = couponResult.data[0];
        
        // 检查优惠券有效期
        if (coupon.expireTime > Date.now()) {
          discount = coupon.discount;
          finalPrice = Math.max(0, plan.price - discount);
        }
      }
    }

    // 生成订单号
    const orderNo = `VIP${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 创建订单
    const ordersCollection = db.collection('orders');
    const orderData = {
      orderNo,
      userId: userInfo.userId,
      userPhone: user.phone,
      productType: `member-${planType}`,
      productName: plan.name,
      amount: plan.price,
      discountAmount: discount,
      finalAmount: finalPrice,
      duration: plan.duration,
      memberLevel: plan.level,
      paymentMethod: null,
      status: 0,
      couponCode,
      createdAt: Date.now(),
      expiredAt: Date.now() + 24 * 60 * 60 * 1000 // 24小时后过期
    };

    const orderResult = await ordersCollection.add(orderData);

    if (!orderResult.id) {
      Logger.error('会员订单创建失败', { userId: userInfo.userId });
      return Response.error(500, '订单创建失败');
    }

    Logger.info('会员订阅订单创建成功', { 
      orderId: orderResult.id, 
      orderNo, 
      planType,
      finalPrice 
    });

    return Response.success({
      orderId: orderResult.id,
      orderNo,
      plan: {
        type: planType,
        name: plan.name,
        price: plan.price,
        originalPrice: plan.originalPrice,
        finalPrice,
        discount,
        duration: plan.duration,
        features: plan.features
      },
      user: {
        currentLevel: user.memberLevel,
        currentExpireTime: user.memberExpireTime,
        isActiveMember: user.memberLevel > 0 && user.memberExpireTime > Date.now()
      },
      expiredAt: orderData.expiredAt
    });

  } catch (error) {
    Logger.error('会员订阅异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
