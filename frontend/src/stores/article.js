import { defineStore } from 'pinia'
import { ref } from 'vue'
import { articleApi } from '../api/article'

export const useArticleStore = defineStore('article', () => {
  // 状态
  const articles = ref([])
  const currentArticle = ref(null)
  const categories = ref([])
  const hotArticles = ref([])
  const total = ref(0)
  const loading = ref(false)
  const searchKeyword = ref('')
  const activeCategory = ref('all')
  const currentPage = ref(1)
  const pageSize = ref(10)

  // 获取文章列表
  const fetchArticles = async (params = {}) => {
    loading.value = true
    try {
      const queryParams = {
        page: currentPage.value,
        pageSize: pageSize.value,
        category: activeCategory.value === 'all' ? undefined : activeCategory.value,
        keyword: searchKeyword.value || undefined,
        ...params
      }

      const res = await articleApi.getList(queryParams)
      articles.value = res.list || []
      total.value = res.total || 0
      return res
    } catch (error) {
      console.error('Failed to fetch articles:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取文章详情
  const fetchArticleDetail = async (id) => {
    loading.value = true
    try {
      const res = await articleApi.getDetail(id)
      currentArticle.value = res
      // 增加阅读量
      articleApi.incrementViews(id).catch(() => {})
      return res
    } catch (error) {
      console.error('Failed to fetch article detail:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取分类列表
  const fetchCategories = async () => {
    try {
      const res = await articleApi.getCategories()
      categories.value = res || []
      return res
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  }

  // 获取热门文章
  const fetchHotArticles = async (limit = 5) => {
    try {
      const res = await articleApi.getHotArticles(limit)
      hotArticles.value = res || []
      return res
    } catch (error) {
      console.error('Failed to fetch hot articles:', error)
      throw error
    }
  }

  // 搜索文章
  const searchArticles = async (keyword, params = {}) => {
    loading.value = true
    searchKeyword.value = keyword
    try {
      const res = await articleApi.search(keyword, {
        page: currentPage.value,
        pageSize: pageSize.value,
        ...params
      })
      articles.value = res.list || []
      total.value = res.total || 0
      return res
    } catch (error) {
      console.error('Failed to search articles:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // 选择分类
  const selectCategory = (category) => {
    activeCategory.value = category
    currentPage.value = 1
    fetchArticles()
  }

  // 分页
  const setPage = (page) => {
    currentPage.value = page
    fetchArticles()
  }

  // 点赞文章
  const likeArticle = async (id) => {
    try {
      await articleApi.like(id)
      if (currentArticle.value && currentArticle.value.id === id) {
        currentArticle.value.likes++
      }
    } catch (error) {
      console.error('Failed to like article:', error)
    }
  }

  // 收藏文章
  const favoriteArticle = async (id) => {
    try {
      await articleApi.favorite(id)
      if (currentArticle.value && currentArticle.value.id === id) {
        currentArticle.value.isFavorited = true
        currentArticle.value.favorites++
      }
    } catch (error) {
      console.error('Failed to favorite article:', error)
    }
  }

  // 取消收藏
  const unfavoriteArticle = async (id) => {
    try {
      await articleApi.unfavorite(id)
      if (currentArticle.value && currentArticle.value.id === id) {
        currentArticle.value.isFavorited = false
        currentArticle.value.favorites--
      }
    } catch (error) {
      console.error('Failed to unfavorite article:', error)
    }
  }

  // 重置状态
  const reset = () => {
    articles.value = []
    currentArticle.value = null
    total.value = 0
    currentPage.value = 1
    searchKeyword.value = ''
    activeCategory.value = 'all'
  }

  return {
    // 状态
    articles,
    currentArticle,
    categories,
    hotArticles,
    total,
    loading,
    searchKeyword,
    activeCategory,
    currentPage,
    pageSize,

    // Actions
    fetchArticles,
    fetchArticleDetail,
    fetchCategories,
    fetchHotArticles,
    searchArticles,
    selectCategory,
    setPage,
    likeArticle,
    favoriteArticle,
    unfavoriteArticle,
    reset
  }
})
