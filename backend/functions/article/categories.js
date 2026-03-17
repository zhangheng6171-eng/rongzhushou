/**
 * 文章分类列表
 * 获取所有文章分类
 */

const { Response, Logger, getDatabase } = require('../../common/utils');

exports.main = async (event, context) => {
  try {
    Logger.info('获取文章分类列表');

    const db = getDatabase();
    const categoriesCollection = db.collection('article_categories');

    // 获取分类列表
    const result = await categoriesCollection
      .where({ status: 1 })
      .orderBy('sort', 'asc')
      .orderBy('createdAt', 'asc')
      .get();

    const categories = result.data || [];

    // 获取每个分类的文章数量
    const articlesCollection = db.collection('articles');
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const countResult = await articlesCollection
          .where({
            categoryId: category._id,
            status: 1
          })
          .count();
        
        return {
          id: category._id,
          name: category.name,
          icon: category.icon,
          description: category.description,
          articleCount: countResult.total || 0
        };
      })
    );

    Logger.info('文章分类列表获取成功', { count: categoriesWithCount.length });

    return Response.success({
      list: categoriesWithCount
    });

  } catch (error) {
    Logger.error('获取文章分类列表异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
