/**
 * 贷款产品列表
 * 获取可用的贷款产品
 */

const { Response, Validator, Logger, getDatabase, getUserFromEvent } = require('../../common/utils');

exports.main = async (event, context) => {
  const { 
    type,           // 产品类型：经营贷/信用贷/抵押贷
    minAmount,      // 最小金额
    maxAmount,      // 最大金额
    page = 1, 
    pageSize = 10 
  } = event;
  
  try {
    const userInfo = getUserFromEvent(event);
    Logger.info('获取贷款产品列表', { type, minAmount, maxAmount, page, pageSize });

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
    const productsCollection = db.collection('loan_products');

    // 构建查询条件
    let query = productsCollection.where({ status: 1 });

    if (type) {
      query = query.where({ type });
    }

    // 获取总数
    const countResult = await query.count();
    const total = countResult.total || 0;

    // 分页查询
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const result = await query
      .orderBy('sort', 'asc')
      .orderBy('createdAt', 'desc')
      .skip(skip)
      .limit(parseInt(pageSize))
      .get();

    let products = result.data || [];

    // 根据金额筛选
    if (minAmount || maxAmount) {
      products = products.filter(product => {
        const productMin = product.minAmount || 0;
        const productMax = product.maxAmount || Infinity;
        
        if (minAmount && productMax < parseFloat(minAmount)) return false;
        if (maxAmount && productMin > parseFloat(maxAmount)) return false;
        
        return true;
      });
    }

    // 格式化产品信息
    const formattedProducts = products.map(product => ({
      id: product._id,
      name: product.name,
      type: product.type,
      bank: product.bank,
      minAmount: product.minAmount,
      maxAmount: product.maxAmount,
      minRate: product.minRate,
      maxRate: product.maxRate,
      minMonths: product.minMonths,
      maxMonths: product.maxMonths,
      features: product.features,
      requirements: product.requirements,
      highlights: product.highlights,
      applyCount: product.applyCount || 0
    }));

    Logger.info('贷款产品列表获取成功', { count: formattedProducts.length, total });

    return Response.success({
      list: formattedProducts,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total,
        totalPages: Math.ceil(total / parseInt(pageSize))
      }
    });

  } catch (error) {
    Logger.error('获取贷款产品列表异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
