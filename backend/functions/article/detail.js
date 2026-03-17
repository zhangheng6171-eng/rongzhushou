/**
 * 文章详情
 * 获取单篇文章详情，包含作者信息、相关文章
 */

const { Response, Logger, getDatabase, getUserFromEvent } = require('../../common/utils');

exports.main = async (event, context) => {
  const { id } = event;
  
  try {
    Logger.info('获取文章详情', { articleId: id });

    if (!id) {
      return Response.error(400, '文章ID不能为空');
    }

    const db = getDatabase();
    const articlesCollection = db.collection('articles');

    // 获取文章详情
    const result = await articlesCollection.doc(id).get();

    if (!result.data || result.data.length === 0) {
      return Response.error(404, '文章不存在');
    }

    const article = result.data[0];

    // 检查文章状态
    if (article.status !== 1) {
      return Response.error(404, '文章不存在或已下架');
    }

    // 获取用户信息（检查是否收藏、点赞）
    const userInfo = getUserFromEvent(event);
    let isFavorite = false;
    let isLiked = false;

    if (userInfo) {
      // 检查收藏状态
      const favoriteResult = await db.collection('user_favorites')
        .where({
          userId: userInfo.userId,
          articleId: id
        })
        .get();
      isFavorite = favoriteResult.data && favoriteResult.data.length > 0;

      // 检查点赞状态
      const likeResult = await db.collection('article_likes')
        .where({
          userId: userInfo.userId,
          articleId: id
        })
        .get();
      isLiked = likeResult.data && likeResult.data.length > 0;
    }

    // 增加浏览量
    await articlesCollection.doc(id).update({
      viewCount: db.command.inc(1)
    });

    // 获取相关文章（同分类）
    let relatedArticles = [];
    if (article.categoryId) {
      const relatedResult = await articlesCollection
        .where({
          categoryId: article.categoryId,
          status: 1,
          _id: db.command.neq(id)
        })
        .orderBy('viewCount', 'desc')
        .limit(5)
        .field({
          _id: true,
          title: true,
          cover: true,
          viewCount: true
        })
        .get();
      relatedArticles = relatedResult.data || [];
    }

    Logger.info('文章详情获取成功', { articleId: id });

    return Response.success({
      article: {
        id: article._id,
        title: article.title,
        content: article.content,
        summary: article.summary,
        cover: article.cover,
        categoryId: article.categoryId,
        categoryName: article.categoryName,
        author: article.author,
        viewCount: (article.viewCount || 0) + 1,
        likeCount: article.likeCount || 0,
        commentCount: article.commentCount || 0,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        isFavorite,
        isLiked
      },
      relatedArticles
    });

  } catch (error) {
    Logger.error('获取文章详情异常', { error: error.message, stack: error.stack });
    return Response.error(500, '服务器错误');
  }
};
