import request from './request'

/**
 * 文章相关API
 */
export const articleApi = {
  // 获取文章列表
  getList: (params) => request.get('/articles', { params }),

  // 获取文章详情
  getDetail: (id) => request.get(`/articles/${id}`),

  // 获取文章分类列表
  getCategories: () => request.get('/articles/categories'),

  // 获取热门文章
  getHotArticles: (limit = 5) =>
    request.get('/articles/hot', { params: { limit } }),

  // 搜索文章
  search: (keyword, params) =>
    request.get('/articles/search', { params: { keyword, ...params } }),

  // 获取推荐文章
  getRecommended: (articleId, limit = 5) =>
    request.get(`/articles/${articleId}/recommended`, { params: { limit } }),

  // 点赞文章
  like: (id) => request.post(`/articles/${id}/like`),

  // 取消点赞
  unlike: (id) => request.delete(`/articles/${id}/like`),

  // 收藏文章
  favorite: (id) => request.post(`/articles/${id}/favorite`),

  // 取消收藏
  unfavorite: (id) => request.delete(`/articles/${id}/favorite`),

  // 获取收藏列表
  getFavorites: (params) => request.get('/user/favorites', { params }),

  // 增加阅读量
  incrementViews: (id) => request.post(`/articles/${id}/view`),

  // 获取文章评论
  getComments: (articleId, params) =>
    request.get(`/articles/${articleId}/comments`, { params }),

  // 发表评论
  addComment: (articleId, content, parentId = null) =>
    request.post(`/articles/${articleId}/comments`, { content, parentId }),

  // 删除评论
  deleteComment: (articleId, commentId) =>
    request.delete(`/articles/${articleId}/comments/${commentId}`),

  // 获取标签列表
  getTags: () => request.get('/articles/tags'),

  // 按标签获取文章
  getByTag: (tag, params) =>
    request.get('/articles/by-tag', { params: { tag, ...params } }),

  // 获取作者文章
  getByAuthor: (authorId, params) =>
    request.get('/articles/by-author', { params: { authorId, ...params } })
}

export default articleApi
