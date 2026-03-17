/**
 * 订单列表
 * 获取用户的订单历史
 */

const { Response, Validator, Logger, getDatabase, getUserFromEvent } = require('../../common/utils');

exports.main = async (event, context) => {
  const { 
    status,     // 订单状态筛选
    page = 1, 
    pageSize = 10 
  } = event;
  
  try {
    // 验证用户身份
    const userInfo = getUserFromEvent(event);
    if (!userInfo) {
      return Response.error(401, '未授权');
    }

    Logger.info('获取订单列表', { userId: userInfo.userId, status, page });

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
          validator: (v) => parseInt(v) >= 1 && parseInt(v) <= 50 ? true : '每页数量必须在1-50之间'
        }
      }
    );

    if (!validation.valid) {
      return Response.error(400, validation.errors[0]);
    }

    const db = getDatabase();
    const ordersCollection = db.collection('orders');

    // 构建查询条件
    let query = ordersCollection.where({ userId: userInfo.userId });

    if (status !== undefined) {
      query = query.where({ status: parseInt(status) });
    }

    // 获取总数
    const countResult = await query.count();
    const total = countResult.total || 0;

    // 分页查询
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const result = await query
      .orderBy('createdAt', 'desc')
      .skip(skip)
      .limit(parseInt(pageSize))
      .get();

    const orders = (result.data || []).map(order => ({
      id: order._id,
      orderNo: order.orderNo,
      productName: order.productName,
      amount: order.amount,
      paymentMethod: order.paymentMethod,
      status: order.status,
      statusText: getStatusText(order.status),
      createdAt: order.createdAt,
      paidAt: order.paidAt,
      expiredAt: order.expiredAt
    }));

    Logger.info('订单列表获取成功', { count: orders.length, total });

    return Response.success({
      list: orders,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total,
        totalPages: Math.ceil(total / parseInt(pageSize))
      }
    });

  } catch (error) {
    Logger.error('获取订单列表异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};

/**
 * 获取订单状态文本
 */
function getStatusText(status) {
  const statusMap = {
    0: '待支付',
    1: '已支付',
    2: '已取消',
    3: '已退款'
  };
  return statusMap[status] || '未知状态';
}
