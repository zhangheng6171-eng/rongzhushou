<template>
  <div class="article-list-page">
    <div class="container">
      <div class="page-header">
        <h1>资讯中心</h1>
        <p>了解最新融资政策、贷款技巧和行业动态</p>
      </div>

      <div class="article-content">
        <div class="sidebar">
          <!-- 搜索框 -->
          <el-card class="search-card">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索文章..."
              clearable
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon><Search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-card>

          <!-- 文章分类 -->
          <el-card>
            <template #header>
              <span>文章分类</span>
            </template>
            <el-menu :default-active="activeCategory" @select="selectCategory">
              <el-menu-item index="all">
                <span>全部文章</span>
                <span class="count">{{ categoryCount.all }}</span>
              </el-menu-item>
              <el-menu-item
                v-for="cat in categories"
                :key="cat.id"
                :index="cat.id"
              >
                <span>{{ cat.name }}</span>
                <span class="count">{{ cat.count }}</span>
              </el-menu-item>
            </el-menu>
          </el-card>

          <!-- 热门文章 -->
          <el-card style="margin-top: 20px">
            <template #header>
              <span>热门文章</span>
            </template>
            <div class="hot-articles">
              <router-link
                v-for="(article, index) in hotArticles"
                :key="article.id"
                :to="`/articles/${article.id}`"
                class="hot-item"
              >
                <span class="rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
                <span class="title">{{ article.title }}</span>
              </router-link>
            </div>
          </el-card>

          <!-- 标签云 -->
          <el-card style="margin-top: 20px">
            <template #header>
              <span>热门标签</span>
            </template>
            <div class="tag-cloud">
              <el-tag
                v-for="tag in tags"
                :key="tag.name"
                :type="tag.type"
                effect="plain"
                @click="selectTag(tag.name)"
                style="cursor: pointer; margin: 5px"
              >
                {{ tag.name }}
              </el-tag>
            </div>
          </el-card>
        </div>

        <div class="main-content">
          <!-- 筛选条件 -->
          <div class="filter-bar" v-if="activeCategory !== 'all' || searchKeyword">
            <div class="active-filters">
              <span v-if="activeCategory !== 'all'" class="filter-tag">
                {{ getCategoryName(activeCategory) }}
                <el-icon @click="selectCategory('all')"><Close /></el-icon>
              </span>
              <span v-if="searchKeyword" class="filter-tag">
                "{{ searchKeyword }}"
                <el-icon @click="clearSearch"><Close /></el-icon>
              </span>
            </div>
          </div>

          <!-- 文章列表 -->
          <div class="article-list" v-loading="loading">
            <div
              v-for="article in articles"
              :key="article.id"
              class="article-card"
            >
              <div class="article-image">
                <img :src="article.cover" :alt="article.title" />
                <el-tag
                  class="category-tag"
                  :type="getTagType(article.category)"
                >
                  {{ article.categoryName }}
                </el-tag>
              </div>
              <div class="article-info">
                <h3>
                  <router-link :to="`/articles/${article.id}`">
                    {{ article.title }}
                  </router-link>
                </h3>
                <p>{{ article.summary }}</p>
                <div class="article-meta">
                  <span class="author">
                    <el-icon><User /></el-icon>
                    {{ article.author }}
                  </span>
                  <span class="date">
                    <el-icon><Calendar /></el-icon>
                    {{ article.date }}
                  </span>
                  <span class="views">
                    <el-icon><View /></el-icon>
                    {{ article.views }}
                  </span>
                  <span class="likes">
                    <el-icon><Star /></el-icon>
                    {{ article.likes || 0 }}
                  </span>
                </div>
              </div>
            </div>

            <el-empty v-if="!loading && articles.length === 0" description="暂无文章" />
          </div>

          <!-- 分页 -->
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            background
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Close, User, Calendar, View, Star } from '@element-plus/icons-vue'
import { articleApi } from '../api/article'

const router = useRouter()
const route = useRoute()

// 状态
const loading = ref(false)
const searchKeyword = ref('')
const activeCategory = ref('all')
const activeTag = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const articles = ref([])
const hotArticles = ref([])

// 分类数据
const categories = ref([
  { id: 'policy', name: '政策解读', count: 25 },
  { id: 'guide', name: '贷款指南', count: 18 },
  { id: 'case', name: '成功案例', count: 12 },
  { id: 'news', name: '行业动态', count: 30 },
  { id: 'skill', name: '融资技巧', count: 15 }
])

// 分类计数
const categoryCount = computed(() => ({
  all: categories.value.reduce((sum, cat) => sum + cat.count, 0)
}))

// 标签数据
const tags = ref([
  { name: '小微企业', type: 'primary' },
  { name: '信用贷款', type: 'success' },
  { name: '抵押贷款', type: 'warning' },
  { name: '利率', type: 'danger' },
  { name: '申请流程', type: 'info' },
  { name: '政策优惠', type: '' },
  { name: '还款方式', type: 'primary' },
  { name: '贷款条件', type: 'success' }
])

// 模拟文章数据
const mockArticles = [
  {
    id: 1,
    title: '2025年小微企业普惠金融政策全面解读',
    summary: '本文详细解读最新出台的小微企业普惠金融政策，包括贷款利率、贴息政策、申请条件等关键信息，助您把握政策红利...',
    cover: 'https://picsum.photos/seed/a1/300/200',
    category: 'policy',
    categoryName: '政策解读',
    author: '融智研究院',
    date: '2025-01-15',
    views: 1258,
    likes: 89
  },
  {
    id: 2,
    title: '小微企业如何选择最适合自己的贷款产品',
    summary: '面对市面上琳琅满目的贷款产品，小微企业应该如何选择？本文从利率、期限、额度等多个维度为您详细分析...',
    cover: 'https://picsum.photos/seed/a2/300/200',
    category: 'guide',
    categoryName: '贷款指南',
    author: '融资顾问小李',
    date: '2025-01-14',
    views: 956,
    likes: 67
  },
  {
    id: 3,
    title: '一家科技初创公司的融资之路',
    summary: '从被多家银行拒绝到成功获得500万贷款，这家科技公司的融资经历给我们带来了哪些启示...',
    cover: 'https://picsum.photos/seed/a3/300/200',
    category: 'case',
    categoryName: '成功案例',
    author: '编辑部',
    date: '2025-01-13',
    views: 834,
    likes: 56
  },
  {
    id: 4,
    title: '银行业数字化转型对小微企业贷款的影响',
    summary: '随着银行业数字化转型的深入，小微企业贷款审批流程、时间、利率都发生了重大变化...',
    cover: 'https://picsum.photos/seed/a4/300/200',
    category: 'news',
    categoryName: '行业动态',
    author: '行业分析师',
    date: '2025-01-12',
    views: 672,
    likes: 45
  },
  {
    id: 5,
    title: '提高贷款通过率的5个关键技巧',
    summary: '很多小微企业在申请贷款时屡屡碰壁，本文总结了提高贷款通过率的5个实用技巧...',
    cover: 'https://picsum.photos/seed/a5/300/200',
    category: 'skill',
    categoryName: '融资技巧',
    author: '资深顾问',
    date: '2025-01-11',
    views: 1123,
    likes: 98
  },
  {
    id: 6,
    title: '央行最新政策：小微企业贷款利率再下调',
    summary: '中国人民银行发布最新通知，小微企业贷款利率将进一步下调，预计惠及数百万小微企业...',
    cover: 'https://picsum.photos/seed/a6/300/200',
    category: 'policy',
    categoryName: '政策解读',
    author: '融智研究院',
    date: '2025-01-10',
    views: 2345,
    likes: 167
  }
]

// 获取分类名称
const getCategoryName = (id) => {
  const cat = categories.value.find((c) => c.id === id)
  return cat ? cat.name : ''
}

// 获取标签类型
const getTagType = (category) => {
  const types = {
    policy: 'danger',
    guide: 'primary',
    case: 'success',
    news: 'warning',
    skill: 'info'
  }
  return types[category] || ''
}

// 加载文章列表
const loadArticles = async () => {
  loading.value = true

  try {
    // 模拟API请求
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredArticles = [...mockArticles]

    // 分类筛选
    if (activeCategory.value !== 'all') {
      filteredArticles = filteredArticles.filter(
        (a) => a.category === activeCategory.value
      )
    }

    // 标签筛选
    if (activeTag.value) {
      filteredArticles = filteredArticles.filter((a) =>
        a.title.includes(activeTag.value)
      )
    }

    // 搜索筛选
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      filteredArticles = filteredArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(keyword) ||
          a.summary.toLowerCase().includes(keyword)
      )
    }

    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value

    articles.value = filteredArticles.slice(start, end)
    total.value = filteredArticles.length
  } catch (error) {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

// 加载热门文章
const loadHotArticles = async () => {
  // 模拟数据
  hotArticles.value = [
    { id: 1, title: '2025年小微企业普惠金融政策全面解读' },
    { id: 6, title: '央行最新政策：小微企业贷款利率再下调' },
    { id: 5, title: '提高贷款通过率的5个关键技巧' },
    { id: 2, title: '小微企业如何选择最适合自己的贷款产品' },
    { id: 3, title: '一家科技初创公司的融资之路' }
  ]
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadArticles()
}

// 清除搜索
const clearSearch = () => {
  searchKeyword.value = ''
  currentPage.value = 1
  loadArticles()
}

// 选择分类
const selectCategory = (index) => {
  activeCategory.value = index
  currentPage.value = 1
  loadArticles()
}

// 选择标签
const selectTag = (tagName) => {
  searchKeyword.value = tagName
  activeTag.value = tagName
  currentPage.value = 1
  loadArticles()
}

// 分页
const handlePageChange = (page) => {
  currentPage.value = page
  loadArticles()
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadArticles()
}

// 监听路由参数
watch(
  () => route.query,
  (query) => {
    if (query.category) {
      activeCategory.value = query.category
    }
    if (query.keyword) {
      searchKeyword.value = query.keyword
    }
    loadArticles()
  },
  { immediate: true }
)

// 初始化
onMounted(() => {
  loadArticles()
  loadHotArticles()
})
</script>

<style scoped>
.article-list-page {
  padding: 40px 0;
  min-height: calc(100vh - 70px);
  background: #f5f7fa;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 32px;
  color: #303133;
  margin-bottom: 10px;
}

.page-header p {
  color: #909399;
  font-size: 16px;
}

.article-content {
  display: flex;
  gap: 30px;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.search-card {
  margin-bottom: 20px;
}

.sidebar :deep(.el-card) {
  border-radius: 12px;
}

.sidebar :deep(.el-menu) {
  border: none;
}

.sidebar :deep(.el-menu-item) {
  display: flex;
  justify-content: space-between;
}

.sidebar :deep(.el-menu-item .count) {
  font-size: 12px;
  color: #909399;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 10px;
}

.hot-articles {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.hot-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #606266;
  text-decoration: none;
  font-size: 14px;
  line-height: 1.5;
  transition: color 0.3s;
}

.hot-item:hover {
  color: #667eea;
}

.hot-item .rank {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: #e0e0e0;
  color: #909399;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hot-item .rank.top {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.hot-item .title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
}

.main-content {
  flex: 1;
}

.filter-bar {
  margin-bottom: 20px;
}

.active-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #ecf5ff;
  color: #667eea;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.filter-tag .el-icon {
  cursor: pointer;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  min-height: 400px;
}

.article-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.article-image {
  width: 240px;
  height: 160px;
  flex-shrink: 0;
  position: relative;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-tag {
  position: absolute;
  top: 10px;
  left: 10px;
}

.article-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.article-info h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
}

.article-info h3 a {
  color: #303133;
  text-decoration: none;
}

.article-info h3 a:hover {
  color: #667eea;
}

.article-info p {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 10px;
}

.article-meta {
  display: flex;
  gap: 20px;
  color: #909399;
  font-size: 12px;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.el-pagination {
  justify-content: center;
}

@media (max-width: 768px) {
  .article-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .article-card {
    flex-direction: column;
  }

  .article-image {
    width: 100%;
    height: 180px;
  }

  .article-meta {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>
