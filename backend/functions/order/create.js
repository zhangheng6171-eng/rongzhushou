/**
 * 创建订单
 * 创建会员订阅订单
 */

const { Response, Validator, Logger, getDatabase, getUserFromEvent } = require('../../common/utils');

exports.main = async (event, context) => {
  const { 
    productType,     // 产品类型：member-月度会员 member-year-年度会员
    paymentMethod    // 支付方式：wechat/alipay
  } = event;
  
  try {
    // 验证用户身份
    const userInfo = getUserFromEvent(event);
    if (!userInfo) {
      return Response.error(401, '未授权');
    }

    Logger.info('创建订单请求', { userId: userInfo.userId, productType, paymentMethod });

    // 参数验证
    const validation = Validator.validate(
      { productType, paymentMethod },
      {
        productType: { 
          required: true,
          validator: (v) => ['member', 'member-year'].includes(v) ? true : '产品类型不正确'
        },
        paymentMethod: { 
          required: true,
          validator: (v) => ['wechat', 'alipay'].includes(v) ? true : '支付方式不正确'
        }
      }
    );

    if (!validation.valid) {
      return Response.error(400, validation.errors[0]);
    }

    const db = getDatabase();

    // 获取产品价格
    const productPrices = {
      'member': {
        name: '月度会员',
        price: 29.9,
        duration: 30, // 天
        level: 1
      },
      'member-year': {
        name: '年度会员',
        price: 299,
        duration: 365,
        level: 2
      }
    };

    const product = productPrices[productType];

    // 检查用户当前会员状态
    const usersCollection = db.collection('users');
    const userResult = await usersCollection.doc(userInfo.userId).get();
    const user = userResult.data && userResult.data[0];

    if (!user) {
      return Response.error(2001, '用户不存在');
    }

    // 生成订单号
    const orderNo = generateOrderNo();

    // 创建订单
    const ordersCollection = db.collection('orders');
    const orderData = {
      orderNo,
      userId: userInfo.userId,
      userPhone: user.phone,
      productType,
      productName: product.name,
      amount: product.price,
      duration: product.duration,
      memberLevel: product.level,
      paymentMethod,
      status: 0, // 0-待支付 1-已支付 2-已取消 3-已退款
      createdAt: Date.now(),
      expiredAt: Date.now() + 30 * 60 * 1000 // 30分钟后过期
    };

    const orderResult = await ordersCollection.add(orderData);

    if (!orderResult.id) {
      Logger.error('订单创建失败', { userId: userInfo.userId });
      return Response.error(500, '订单创建失败');
    }

    // 调用支付接口（模拟）
    const paymentInfo = await createPayment(orderNo, product.price, paymentMethod, user.phone);

    Logger.info('订单创建成功', { 
      orderId: orderResult.id, 
      orderNo, 
      amount: product.price 
    });

    return Response.success({
      orderId: orderResult.id,
      orderNo,
      productName: product.name,
      amount: product.price,
      paymentMethod,
      paymentInfo,
      expiredAt: orderData.expiredAt
    });

  } catch (error) {
    Logger.error('创建订单异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};

/**
 * 生成订单号
 */
function generateOrderNo() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  return `RZ${year}${month}${day}${random}`;
}

/**
 * 创建支付（模拟）
 * 生产环境应调用真实的支付API
 */
async function createPayment(orderNo, amount, paymentMethod, phone) {
  // 模拟支付参数
  if (paymentMethod === 'wechat') {
    return {
      // 微信支付需要的参数
      appId: process.env.WECHAT_APP_ID || 'wx_test_app_id',
      timeStamp: String(Math.floor(Date.now() / 1000)),
      nonceStr: Math.random().toString(36).substring(2, 15),
      package: `prepay_id=wx_prepay_${orderNo}`,
      signType: 'MD5',
      paySign: 'mock_sign_for_test'
    };
  } else {
    return {
      // 支付宝支付需要的参数
      orderStr: `alipay_order_${orderNo}`,
      qrCode: `https://qr.alipay.com/${orderNo}`
    };
  }
}
