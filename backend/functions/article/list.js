/**
 * 文章列表
 * 支持分类筛选、分页、搜索
 */

const { Response, Validator, Logger, getDatabase } = require('../../common/utils');

exports.main = async (event, context) => {
  const { 
    categoryId, 
    keyword, 
    page = 1, 
    pageSize = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = event;
  
  try {
    Logger.info('获取文章列表', { categoryId, keyword, page, pageSize });

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
    const articlesCollection = db.collection('articles');

    // 构建查询条件
    let query = articlesCollection.where({ status: 1 }); // 1-已发布

    if (categoryId) {
      query = query.where({ categoryId });
    }

    if (keyword) {
      query = query.where({
        $or: [
          { title: db.RegExp({ regexp: keyword, options: 'i' }) },
          { content: db.RegExp({ regexp: keyword, options: 'i' }) }
        ]
      });
    }

    // 获取总数
    const countResult = await query.count();
    const total = countResult.total || 0;

    // 分页查询
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    // 排序
    const order = sortOrder === 'asc' ? 'asc' : 'desc';
    let orderField = sortBy;
    if (!['createdAt', 'updatedAt', 'viewCount', 'likeCount'].includes(sortBy)) {
      orderField = 'createdAt';
    }

    const result = await query
      .orderBy(orderField, order)
      .skip(skip)
      .limit(limit)
      .field({
        _id: true,
        title: true,
        summary: true,
        cover: true,
        categoryId: true,
        categoryName: true,
        author: true,
        viewCount: true,
        likeCount: true,
        commentCount: true,
        createdAt: true,
        updatedAt: true
      })
      .get();

    const articles = result.data || [];

    Logger.info('文章列表查询成功', { count: articles.length, total });

    return Response.success({
      list: articles,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total,
        totalPages: Math.ceil(total / parseInt(pageSize))
      }
    });

  } catch (error) {
    Logger.error('获取文章列表异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
