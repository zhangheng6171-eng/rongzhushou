<template>
  <div class="article-detail-page">
    <div class="container">
      <el-row :gutter="30">
        <el-col :xs="24" :lg="17">
          <article class="article-content">
            <div class="article-header">
              <el-tag :type="getTagType(article.category)">{{ article.categoryName }}</el-tag>
              <h1>{{ article.title }}</h1>
              <div class="article-meta">
                <span><el-icon><User /></el-icon> {{ article.author }}</span>
                <span><el-icon><Calendar /></el-icon> {{ article.date }}</span>
                <span><el-icon><View /></el-icon> {{ article.views }}阅读</span>
              </div>
            </div>

            <div class="article-body" v-html="article.content"></div>

            <div class="article-footer">
              <div class="tags">
                <el-tag v-for="tag in article.tags" :key="tag" size="small">{{ tag }}</el-tag>
              </div>
              <div class="share">
                <span>分享到：</span>
                <el-button circle size="small" icon="Share" />
              </div>
            </div>
          </article>

          <div class="related-articles">
            <h3>相关文章</h3>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="8" v-for="item in relatedArticles" :key="item.id">
                <router-link :to="`/articles/${item.id}`" class="related-item">
                  <img :src="item.cover" :alt="item.title" />
                  <h4>{{ item.title }}</h4>
                </router-link>
              </el-col>
            </el-row>
          </div>
        </el-col>

        <el-col :xs="24" :lg="7">
          <div class="sidebar">
            <el-card class="author-card">
              <div class="author-info">
                <el-avatar :size="50">{{ article.author.charAt(0) }}</el-avatar>
                <div class="info">
                  <h4>{{ article.author }}</h4>
                  <p>已发布 28 篇文章</p>
                </div>
              </div>
              <el-button type="primary" size="small" plain block>关注</el-button>
            </el-card>

            <el-card class="toc-card">
              <template #header>
                <span>目录</span>
              </template>
              <el-menu>
                <el-menu-item v-for="(item, index) in toc" :key="index">{{ item }}</el-menu-item>
              </el-menu>
            </el-card>

            <el-card class="cta-card">
              <h3>需要融资帮助？</h3>
              <p>我们的AI顾问随时为您解答</p>
              <el-button type="primary" @click="$router.push('/ai-counselor')" block>
                立即咨询
              </el-button>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { User, Calendar, View } from '@element-plus/icons-vue'

const route = useRoute()

const article = ref({
  id: 1,
  title: '2025年小微企业普惠金融政策全面解读',
  categoryName: '政策解读',
  category: 'policy',
  author: '融智研究院',
  date: '2025-01-15',
  views: 1258,
  tags: ['小微企业', '普惠金融', '贷款政策'],
  content: `
    <h2>一、政策背景</h2>
    <p>2025年，国家继续加大对小微企业的金融支持力度，出台了一系列普惠金融政策。这些政策旨在解决小微企业融资难、融资贵的问题，促进实体经济发展。</p>
    
    <h2>二、核心政策要点</h2>
    <h3>1. 贷款利率优惠</h3>
    <p>普惠型小微企业贷款利率上限进一步下调，部分银行可提供低至3.5%的年化利率。</p>
    
    <h3>2. 贴息政策</h3>
    <p>符合条件的科技型小微企业，可享受政府贴息政策，贴息比例最高可达50%。</p>
    
    <h3>3. 担保费减免</h3>
    <p>通过政府性融资担保机构担保的贷款，担保费率降低至1%以下。</p>
    
    <h2>三、申请条件</h2>
    <ul>
      <li>企业注册满1年以上</li>
      <li>年度纳税额不低于5万元</li>
      <li>企业及法定代表人信用良好</li>
      <li>符合小微企业认定标准</li>
    </ul>
    
    <h2>四、申请流程</h2>
    <ol>
      <li>准备申请材料（营业执照、财务报表、纳税证明等）</li>
      <li>选择合适的贷款产品</li>
      <li>提交贷款申请</li>
      <li>银行审批（一般3-5个工作日）</li>
      <li>签订合同，放款</li>
    </ol>
    
    <h2>五、注意事项</h2>
    <p>申请贷款前，建议企业做好财务规划，确保有足够的还款能力。同时，要保持良好的信用记录，这是获得贷款的关键因素。</p>
  `
})

const toc = ref(['政策背景', '核心政策要点', '申请条件', '申请流程', '注意事项'])

const relatedArticles = ref([
  { id: 2, title: '小微企业如何选择最适合自己的贷款产品', cover: 'https://picsum.photos/seed/r1/300/180' },
  { id: 3, title: '信用贷款vs抵押贷款：深度对比分析', cover: 'https://picsum.photos/seed/r2/300/180' },
  { id: 4, title: '贷款被拒？可能是这些原因', cover: 'https://picsum.photos/seed/r3/300/180' }
])

const getTagType = (category) => {
  const types = { policy: 'danger', guide: 'primary', case: 'success', news: 'warning' }
  return types[category] || ''
}

onMounted(() => {
  // 根据 route.params.id 加载文章详情
})
</script>

<style scoped>
.article-detail-page {
  padding: 40px 0;
  min-height: calc(100vh - 70px);
  background: #f5f7fa;
}

.article-content {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 30px;
}

.article-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.article-header h1 {
  font-size: 28px;
  margin: 15px 0;
  color: #303133;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  gap: 25px;
  color: #909399;
  font-size: 14px;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.article-body {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.article-body :deep(h2) {
  font-size: 22px;
  margin: 35px 0 15px;
  padding-left: 15px;
  border-left: 4px solid #667eea;
}

.article-body :deep(h3) {
  font-size: 18px;
  margin: 25px 0 12px;
}

.article-body :deep(p) {
  margin-bottom: 15px;
}

.article-body :deep(ul), .article-body :deep(ol) {
  padding-left: 30px;
  margin-bottom: 15px;
}

.article-body :deep(li) {
  margin-bottom: 8px;
}

.article-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  gap: 10px;
}

.share {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #909399;
}

.related-articles {
  background: #fff;
  border-radius: 12px;
  padding: 30px;
}

.related-articles h3 {
  font-size: 18px;
  margin-bottom: 20px;
}

.related-item {
  display: block;
  text-decoration: none;
}

.related-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}

.related-item h4 {
  font-size: 14px;
  color: #303133;
  line-height: 1.4;
}

.sidebar {
  position: sticky;
  top: 90px;
}

.sidebar :deep(.el-card) {
  border-radius: 12px;
  margin-bottom: 20px;
}

.author-card {
  padding: 20px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.author-info h4 {
  font-size: 16px;
  margin-bottom: 5px;
}

.author-info p {
  font-size: 12px;
  color: #909399;
}

.toc-card :deep(.el-menu) {
  border: none;
}

.cta-card {
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.cta-card :deep(.el-card__body) {
  padding: 30px 20px;
}

.cta-card h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.cta-card p {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .article-content {
    padding: 20px;
  }
  
  .article-header h1 {
    font-size: 22px;
  }
  
  .sidebar {
    position: static;
  }
}
</style>
